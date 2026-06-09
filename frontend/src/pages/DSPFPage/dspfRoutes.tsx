
import { type ElementType } from 'react';
import FILE1 from "./FILE1"
import FILE2 from "./FILE2"
import WORD from "./WORD"

type DFPSRoutes = {
  name: string;
  component: ElementType;
}[];

const dfpsRoutes: DFPSRoutes = [{name:"FILE1",component:FILE1},{name:"FILE2",component:FILE2},{name:"WORD",component:WORD}];

export default dfpsRoutes;
