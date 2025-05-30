import React, { useEffect, useState } from "react";
import { ButtonHeader } from "../core/header/button-header";
import Toggle from "@atlaskit/toggle";
import { invoke } from "@forge/bridge";
import "./validator.css";

export const Validator = () => {
  const [validators, setValidators] = useState([]);

  useEffect(() => {
    invoke("fetchValidationTypes").then(setValidators);
  }, []);

  return (
    <div>
      <ButtonHeader activeIndex={1} />
      <p>This is the validations page. You can view available validators.</p>

      <div className="validator-list">
        {validators.map((validator) => (
          <div className="validator-card" key={validator.name}>
            <div>
              <div className="validator-title">{validator.name}</div>
              <div className="validator-desc">{validator.description}</div>
            </div>
            <Toggle isChecked={validator.active} isDisabled size="large" />
          </div>
        ))}
      </div>
    </div>
  );
};
