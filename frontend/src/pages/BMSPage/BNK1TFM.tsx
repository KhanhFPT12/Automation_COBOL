
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1TFM() {
    
    type formInput = {
        faccno: string,
taccno: string,
amt: string,

    }

    type formOutput = {
        bnk1tfm: string,
bnk1tf: string,
company: string,
faccno2: string,
taccno2: string,
fsortc: string,
tsortc: string,
factbal: string,
tactbal: string,
favbal: string,
tavbal: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        faccno: '',
taccno: '',
amt: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1tfm: '',
bnk1tf: '',
company: 'CICS Banking Sample Application - Transfer funds.',
faccno2: '',
taccno2: '',
fsortc: '      ',
tsortc: '      ',
factbal: '',
tactbal: '',
favbal: '',
tavbal: '',
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
        httpConfig.domain + '/Bnk1tfm',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1TFM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color: "blue"}}>
         {"BNK1TF "}
    </label>
</GridItem>

    
<GridItem col={17} row={1}>
    <label style={{color: "red"}}>
         {receivedData.company }
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color: "turquoise"}}>
         {"Provide a FROM account, a TO account and an Amount and press Enter."}
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color: "turquoise"}}>
         {"FROM Account Number:"}
    </label>
</GridItem>

    
<GridItem col={23} row={8}>
    <Input maxLength={8} name='faccno' id='faccno' type='number' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={32} row={8}>
    <label style={{color: "turquoise"}}>
         {"TO Account Number:"}
    </label>
</GridItem>

    
<GridItem col={52} row={8}>
    <Input maxLength={8} name='taccno' id='taccno' type='number' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={61} row={8}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={9}>
    <label style={{color: "turquoise"}}>
         {"AMOUNT:"}
    </label>
</GridItem>

    
<GridItem col={23} row={9}>
    <Input maxLength={13} name='amt' id='amt' type='text' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={37} row={9}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={11}>
    <label style={{color: "turquoise"}}>
         {"FROM Account   :"}
    </label>
</GridItem>

    
<GridItem col={20} row={11}>
    <label style={{color: "turquoise"}}>
         {receivedData.faccno2 }
    </label>
</GridItem>

    
<GridItem col={35} row={11}>
    <label style={{color: "turquoise"}}>
         {"TO Account     :"}
    </label>
</GridItem>

    
<GridItem col={55} row={11}>
    <label style={{color: "turquoise"}}>
         {receivedData.taccno2 }
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label style={{color: "turquoise"}}>
         {"Sort Code      :"}
    </label>
</GridItem>

    
<GridItem col={20} row={12}>
    <label style={{color: "inherit"}}>
         {receivedData.fsortc }
    </label>
</GridItem>

    
<GridItem col={35} row={12}>
    <label style={{color: "turquoise"}}>
         {"Sort Code      :"}
    </label>
</GridItem>

    
<GridItem col={55} row={12}>
    <label style={{color: "inherit"}}>
         {receivedData.tsortc }
    </label>
</GridItem>

    
<GridItem col={1} row={13}>
    <label style={{color: "turquoise"}}>
         {"Actual Balance :"}
    </label>
</GridItem>

    
<GridItem col={19} row={13}>
    <label style={{color: "inherit"}}>
         {receivedData.factbal }
    </label>
</GridItem>

    
<GridItem col={35} row={13}>
    <label style={{color: "turquoise"}}>
         {"Actual Balance :"}
    </label>
</GridItem>

    
<GridItem col={54} row={13}>
    <label style={{color: "inherit"}}>
         {receivedData.tactbal }
    </label>
</GridItem>

    
<GridItem col={1} row={14}>
    <label style={{color: "turquoise"}}>
         {"Avail Balance  :"}
    </label>
</GridItem>

    
<GridItem col={19} row={14}>
    <label style={{color: "inherit"}}>
         {receivedData.favbal }
    </label>
</GridItem>

    
<GridItem col={35} row={14}>
    <label style={{color: "turquoise"}}>
         {"Avail Balance  :"}
    </label>
</GridItem>

    
<GridItem col={54} row={14}>
    <label style={{color: "inherit"}}>
         {receivedData.tavbal }
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
    