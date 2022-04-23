import * as React from 'react';
import type { Store } from 'src/store/StoreType';

export default function useStore<T>(store: Store<T>): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_value, setValue] = React.useState<T>(store.getValue);
  React.useEffect(() => {
    store.subscribe(setValue);
    return () => {
      store.unsubscribe(setValue);
    };
  }, [store]);
  return store.getValue();
}
