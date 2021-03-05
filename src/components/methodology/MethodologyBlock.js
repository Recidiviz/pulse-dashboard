import React from "react";
import PropTypes from "prop-types";

import ModelInfrastructureBlock from "./ModelInfrastructureBlock";

const MethodologyBlock = ({ contentBlock, target }) => {
  return (
    <div id={target}>
      <h3>{contentBlock.label}</h3>
      <hr />
      {contentBlock.includeTable ? (
        <ModelInfrastructureBlock />
      ) : (
        <>
          {contentBlock.list === undefined ? (
            <p>{contentBlock.text}</p>
          ) : (
            <>
              <p>{contentBlock.text}</p>
              <ul>
                {contentBlock.list.map((liText) => (
                  <li key={liText}>{liText}</li>
                ))}
              </ul>
            </>
          )}
          <div className="row" />
        </>
      )}
    </div>
  );
};
MethodologyBlock.propTypes = {
  target: PropTypes.string.isRequired,
  contentBlock: PropTypes.shape({
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.string),
    includeTable: PropTypes.bool,
  }).isRequired,
};
export default MethodologyBlock;
