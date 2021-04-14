import React from "react";
import PropTypes from "prop-types";
import ScrollableAnchor from "react-scrollable-anchor";

import ModelInfrastructureBlock from "./ModelInfrastructureBlock";

const MethodologyBlock = ({ contentBlock, target }) => {
  return (
    <ScrollableAnchor id={target}>
      <div>
        <h3 className="methodology__sub-block--title ">{contentBlock.label}</h3>
        <hr />
        {contentBlock.includeTable ? (
          <ModelInfrastructureBlock />
        ) : (
          <>
            {contentBlock.list === undefined ? (
              <p className="methodology__sub-block--description">
                {contentBlock.text}
              </p>
            ) : (
              <>
                <p className="methodology__sub-block--description">
                  {contentBlock.text}
                </p>
                <ul className="methodology__sub-block--description">
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
    </ScrollableAnchor>
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
