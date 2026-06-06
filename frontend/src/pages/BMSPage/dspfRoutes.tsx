
import { type ElementType } from 'react';
import BNK1ACC from "./BNK1ACC"
import BNK1B2M from "./BNK1B2M"
import BNK1CAM from "./BNK1CAM"
import BNK1CCM from "./BNK1CCM"
import BNK1CDM from "./BNK1CDM"
import BNK1DAM from "./BNK1DAM"
import BNK1DCM from "./BNK1DCM"
import BNK1MAI from "./BNK1MAI"
import BNK1TFM from "./BNK1TFM"
import BNK1UAM from "./BNK1UAM"

type DFPSRoutes = {
  name: string;
  component: ElementType;
}[];

const dfpsRoutes: DFPSRoutes = [{name:"BNK1ACC",component:BNK1ACC},{name:"BNK1B2M",component:BNK1B2M},{name:"BNK1CAM",component:BNK1CAM},{name:"BNK1CCM",component:BNK1CCM},{name:"BNK1CDM",component:BNK1CDM},{name:"BNK1DAM",component:BNK1DAM},{name:"BNK1DCM",component:BNK1DCM},{name:"BNK1MAI",component:BNK1MAI},{name:"BNK1TFM",component:BNK1TFM},{name:"BNK1UAM",component:BNK1UAM}];

export default dfpsRoutes;
