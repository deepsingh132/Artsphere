/**
 * FIXME:  Custom type for JSONB column (Due to a bug which causes JSONB to be inserted as a string from the database)
 * NOTE: The below code is a HACK/Workaround, not to be used in production if the bug is fixed in the future
 * TODO: Remove this file and use the JSONB type directly from drizzle-orm/pg-core
*/

import { customType } from 'drizzle-orm/pg-core';

const jsonb = customType<{ data: any }>({
  dataType() {
    return 'jsonb';
  },
  toDriver(val) {
    return val as any;
  },
  fromDriver(value) {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as any;
      } catch {}
    }
    return value as any;
  },
});

export default jsonb;