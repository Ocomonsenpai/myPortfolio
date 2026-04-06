const Contact = () => {
  return (
    <div className="aboutContact">
      <div className="fNavbar_link">
        <a href="#about">ABOUT</a>
        <a href="#expertise">EXPERTISE</a>
        <a href="#works">WORKS</a>
        <a href="#contact">CONTACT</a>
      </div>
      <div className="info">
        <h1 className="f-name">RYAN TACAISAN</h1>
        <div className="social">
          <a href="https://web.facebook.com/tacaisan.ryan">FACEBOOK</a>
          <a href="https://www.linkedin.com/in/ryan-tacaisan-b56987307/">LINKEDIN</a>
        </div>

        <h3 className="email">
          <span className="email-label">EMAIL:</span>{" "}
          <a href="mailto:ryantacaisan@13gmail.com">ryantacaisan@gmail.com</a>
        </h3>
        <h1 className="ft-text">CREATIVE FRONTEND DEVELOPER</h1>
      </div>
    </div>
  );
};

export default Contact;
