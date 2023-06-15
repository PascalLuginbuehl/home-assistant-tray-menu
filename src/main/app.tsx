import React, { Suspense } from "react";

import { Entities } from "./entities";

export function App() {
  return (
    <div>
      <Suspense fallback="Loading...">
        <Entities />
      </Suspense>
    </div>
  )
}
