import React from 'react';
import Scroll from 'react-scroll';
import { focusElement } from '../../../../platform/utilities/ui';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    // const { submission, data } = this.props.form;
    // const { response } = submission;
    // const name = data.veteranFullName;

    return (
      <div>
        {/* <h3 className="confirmation-page-title">Claim received</h3>
        <p>
          We usually process claims within <strong>a week</strong>.
        </p>
        <p>
          We may contact you for more information or documents.
          <br />
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>
            Form 2346 Claim <span className="additional">(Form 2346)</span>
          </h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Date received</strong>
                <br />
                <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
              </li>
            </ul>
          )}
        </div> */}
        <h2>Your order is confirmed</h2>
        <i className="form2346 fas fa-check-circle fa-4x" />
        <section>
          <h2>What happens next</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            ex, repellendus est sed hic totam perspiciatis aut autem iusto earum
            obcaecati dolorum cumque exercitationem distinctio fugit voluptas
            commodi impedit voluptatibus.
          </p>
        </section>
        <section className="vads-u-margin-bottom--4">
          <h2>What to do in the meantime</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum cum
            provident laudantium quo qui id fuga minima vero aliquam,
            necessitatibus architecto asperiores nemo dolores non blanditiis
            rerum sequi dignissimos. Iste.
          </p>
        </section>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     form: state.form,
//   };
// }

// export default connect(mapStateToProps)(ConfirmationPage);
export default ConfirmationPage;
