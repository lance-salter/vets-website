const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const chalk = require('chalk');

const entityMap = require('./entities');

const entityDir = path.join(__dirname, 'entities');
const assembleEntityTree = require('../index')(entityDir);

const { getContentModelType, readEntity } = require('../helpers');
const { getEntityTransformer } = require('../transform');

const transformedEntitiesDir = path.join(__dirname, 'transformed-entities');
const transformedEntitiesList = fs.readdirSync(transformedEntitiesDir);

Object.entries(entityMap).forEach(([contentModelType, entityFileName]) => {
  describe(contentModelType, () => {
    const entity = readEntity(
      entityDir,
      ...entityFileName.split('.').slice(0, 2),
    );

    it('entry in the test entity map should match the content model type', () => {
      expect(contentModelType).to.equal(getContentModelType(entity));
    });

    // Test 2: Look for a post-transformation json file matching the entity type
    //         If one exists, run the transformation on it and compare the result
    if (getEntityTransformer(contentModelType, false)) {
      it('should transform to match the test output', () => {
        const transformedFileName = `${contentModelType}.json`;

        // We have a transformer, but no transformed JSON file;
        // Output what we think the transformed entity should look like
        if (!transformedEntitiesList.includes(transformedFileName)) {
          process.stdout.write(
            `${chalk.red(
              `No transformed entity JSON file found for ${contentModelType}.\n`,
            )}\nassembleEntityTree result for ${contentModelType}:\n${JSON.stringify(
              assembleEntityTree(entity),
              null,
              2,
            )}\n`,
          );
          throw new Error(
            `No transformed entity JSON file found for ${contentModelType}`,
          );
        }

        const transformedEntity = JSON.parse(
          fs.readFileSync(
            path.join(transformedEntitiesDir, transformedFileName),
          ),
        );
        expect(assembleEntityTree(entity)).to.deep.equal(transformedEntity);
      });
    }
  });
});
