import React from "react";

const Debug = ({ isPermitted, data }) => (
  <div className="alert alert-info">
    { isPermitted && <strong>Authenticated, and within bounds</strong> }
    <pre className="mb-0">
      { JSON.stringify(data) }
    </pre>
  </div>
)

export default Debug;
