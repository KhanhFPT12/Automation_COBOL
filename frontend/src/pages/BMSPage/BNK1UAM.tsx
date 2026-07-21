
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1UAM() {
    
    type formInput = {
        accno: string,
actype: string,
intrt: string,
overdr: string,

    }

    type formOutput = {
        bnk1uam: string,
bnk1ua: string,
company: string,
custno: string,
sortc: string,
accno2: string,
opendd: string,
openmm: string,
openyy: string,
lstmtdd: string,
lstmtmm: string,
lstmtyy: string,
nstmtdd: string,
nstmtmm: string,
nstmtyy: string,
avbal: string,
actbal: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        accno: '',
actype: '',
intrt: '',
overdr: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1uam: '',
bnk1ua: '',
company: 'CICS Banking Sample Application - Update Account.',
custno: '',
sortc: '',
accno2: '',
opendd: '',
openmm: '',
openyy: '',
lstmtdd: '',
lstmtmm: '',
lstmtyy: '',
nstmtdd: '',
nstmtmm: '',
nstmtyy: '',
avbal: '',
actbal: '',
message: '',
dummy: ' ',

    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((state) => {
        return {
        ...state,
        [event.target.name]: event.target.value,
        };
    });
    };

    const handleSubmit = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        for (const key in formData) {
        if (!formData[key as keyof typeof formData]) {
            return;
        }
        }

        const response = await axios.post(
        httpConfig.domain + '/Bnk1uam',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1UAM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color: "blue"}}>
         {"BNK1UA "}
    </label>
</GridItem>

    
<GridItem col={17} row={1}>
    <label style={{color: "red"}}>
         {receivedData.company }
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color: "turquoise"}}>
         {"Please provide an ACCOUNT number."}
    </label>
</GridItem>

    
<GridItem col={1} row={5}>
    <label style={{color: "turquoise"}}>
         {"ACCOUNT NUMBER"}
    </label>
</GridItem>

    
<GridItem col={17} row={5}>
    <Input maxLength={8} name='accno' id='accno' type='number' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={26} row={5}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={7}>
    <label style={{color: "inherit"}}>
         {" Customer Number:"}
    </label>
</GridItem>

    
<GridItem col={20} row={7}>
    <label style={{color: "turquoise"}}>
         {receivedData.custno }
    </label>
</GridItem>

    
<GridItem col={32} row={7}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color: "inherit"}}>
         {" Sort Code      :"}
    </label>
</GridItem>

    
<GridItem col={20} row={8}>
    <label style={{color: "turquoise"}}>
         {receivedData.sortc }
    </label>
</GridItem>

    
<GridItem col={27} row={8}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={9}>
    <label style={{color: "inherit"}}>
         {" Account Number :"}
    </label>
</GridItem>

    
<GridItem col={20} row={9}>
    <label style={{color: "turquoise"}}>
         {receivedData.accno2 }
    </label>
</GridItem>

    
<GridItem col={32} row={9}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={10}>
    <label style={{color: "inherit"}}>
         {" Account Type   :"}
    </label>
</GridItem>

    
<GridItem col={20} row={10}>
    <Input maxLength={8} name='actype' id='actype' type='text' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={29} row={10}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={11}>
    <label style={{color: "inherit"}}>
         {" Interest Rate  :"}
    </label>
</GridItem>

    
<GridItem col={20} row={11}>
    <Input maxLength={7} name='intrt' id='intrt' type='text' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={28} row={11}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label style={{color: "inherit"}}>
         {" Account Opened :"}
    </label>
</GridItem>

    
<GridItem col={20} row={12}>
    <label style={{color: "turquoise"}}>
         {receivedData.opendd }
    </label>
</GridItem>

    
<GridItem col={23} row={12}>
    <label style={{color: "turquoise"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={25} row={12}>
    <label style={{color: "turquoise"}}>
         {receivedData.openmm }
    </label>
</GridItem>

    
<GridItem col={28} row={12}>
    <label style={{color: "turquoise"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={30} row={12}>
    <label style={{color: "turquoise"}}>
         {receivedData.openyy }
    </label>
</GridItem>

    
<GridItem col={1} row={13}>
    <label style={{color: "inherit"}}>
         {" Overdraft limit:"}
    </label>
</GridItem>

    
<GridItem col={20} row={13}>
    <Input maxLength={8} name='overdr' id='overdr' type='text' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={29} row={13}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={14}>
    <label style={{color: "inherit"}}>
         {" Last statement :"}
    </label>
</GridItem>

    
<GridItem col={20} row={14}>
    <label style={{color: "turquoise"}}>
         {receivedData.lstmtdd }
    </label>
</GridItem>

    
<GridItem col={23} row={14}>
    <label style={{color: "turquoise"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={25} row={14}>
    <label style={{color: "turquoise"}}>
         {receivedData.lstmtmm }
    </label>
</GridItem>

    
<GridItem col={28} row={14}>
    <label style={{color: "turquoise"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={30} row={14}>
    <label style={{color: "turquoise"}}>
         {receivedData.lstmtyy }
    </label>
</GridItem>

    
<GridItem col={35} row={14}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={15}>
    <label style={{color: "inherit"}}>
         {" Next statement :"}
    </label>
</GridItem>

    
<GridItem col={20} row={15}>
    <label style={{color: "turquoise"}}>
         {receivedData.nstmtdd }
    </label>
</GridItem>

    
<GridItem col={23} row={15}>
    <label style={{color: "inherit"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={25} row={15}>
    <label style={{color: "turquoise"}}>
         {receivedData.nstmtmm }
    </label>
</GridItem>

    
<GridItem col={28} row={15}>
    <label style={{color: "inherit"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={30} row={15}>
    <label style={{color: "turquoise"}}>
         {receivedData.nstmtyy }
    </label>
</GridItem>

    
<GridItem col={1} row={16}>
    <label style={{color: "inherit"}}>
         {" Available Bal  :"}
    </label>
</GridItem>

    
<GridItem col={19} row={16}>
    <label style={{color: "turquoise"}}>
         {receivedData.avbal }
    </label>
</GridItem>

    
<GridItem col={1} row={17}>
    <label style={{color: "inherit"}}>
         {" Actual Balance :"}
    </label>
</GridItem>

    
<GridItem col={19} row={17}>
    <label style={{color: "turquoise"}}>
         {receivedData.actbal }
    </label>
</GridItem>

    
<GridItem col={1} row={23}>
    <label style={{color: "yellow", fontWeight: "bold"}}>
         {receivedData.message }
    </label>
</GridItem>

    
<GridItem col={1} row={24}>
    <label style={{color: "blue"}}>
         {"F3=Exit   F12=Cancel"}
    </label>
</GridItem>

    
<GridItem col={79} row={24}>
    <label style={{visibility: "hidden"}}>
         {receivedData.dummy }
    </label>
</GridItem>

    
    </>
  );
}
    