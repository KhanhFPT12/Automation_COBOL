
import { type ElementType } from 'react';
import FILE1 from "./FILE1"
import FILE2_RAN331DA from "./FILE2_RAN331DA"
import FILE2_RAN331DB from "./FILE2_RAN331DB"
import WEB_GETNAME from "./WEB_GETNAME"
import WEB_SHOWINFO from "./WEB_SHOWINFO"
import WORD from "./WORD"

type DFPSRoutes = {
  name: string;
  component: ElementType;
}[];

const dfpsRoutes: DFPSRoutes = [{name:"FILE1",component:FILE1},{name:"FILE2_RAN331DA",component:FILE2_RAN331DA},{name:"FILE2_RAN331DB",component:FILE2_RAN331DB},{name:"WEB_GETNAME",component:WEB_GETNAME},{name:"WEB_SHOWINFO",component:WEB_SHOWINFO},{name:"WORD",component:WORD}];

export default dfpsRoutes;
