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
          <a href="#">FACEBOOK</a>
          <a href="#">WHATSAPP</a>
        </div>

        <h3 className="email">
          <span className="email-label">EMAIL:</span>{" "}
          <a href="mailto:ryantacaisan@gmail.com">ryantacaisan@gmail.com</a>
        </h3>
        <h1 className="ft-text">CREATIVE FRONTEND DEVELOPER</h1>
      </div>
    </div>
  );
};

export default Contact;
