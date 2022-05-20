import createStore from 'src/store/createStore';
import type { HoverCoordinates } from 'src/time_series/utils/HoverCoordinatesType';

type HoverComponentStoreType = Readonly<{
  coordinates: HoverCoordinates | undefined;
  component: JSX.Element | undefined;
}>;

const HoverComponentStore = createStore<HoverComponentStoreType>({
  component: undefined,
  coordinates: undefined,
});

export default HoverComponentStore;
