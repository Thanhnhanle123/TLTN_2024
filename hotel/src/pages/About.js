// src/components/About.js
import React from "react";
import { FormattedMessage } from "react-intl";

const About = () => {
  return (
    <div className="page-container">
      <h2><FormattedMessage id={"about"} defaultMessage={"about"} /></h2>
      <div className="page-contain" style={{width: "98%", display: "flex", justifyContent: "center"}}>
        <FormattedMessage id={"aboutContent"} defaultMessage={"aboutContent"} />
      </div>
      <br />
      <div className="page-contain" style={{width: "98%", display: "flex", justifyContent: "center"}}>
        <FormattedMessage id={"aboutContent2"} defaultMessage={"aboutContent2"} />
      </div>
    </div>
  );
};

export default About;
