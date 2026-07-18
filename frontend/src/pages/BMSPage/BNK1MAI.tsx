
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1MAI() {
    
    type formInput = {
        action: string,

    }

    type formOutput = {
        bnk1mai: string,
bnk1me: string,
company: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        action: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1mai: '',
bnk1me: '',
company: 'CICS Banking Sample Application - Main Menu.',
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
        httpConfig.domain + '/Bnk1mai',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1MAI</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color:"blue"}}>
         BNK1MA  
    </label>
</GridItem>

    
<GridItem col={20} row={1}>
    <label style={{color:"red"}}>
         {receivedData.company } 
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color:"turquoise"}}>
         Select an option. Then press Enter. 
    </label>
</GridItem>

    
<GridItem col={1} row={5}>
    <label style={{color:"turquoise"}}>
         Action . . . . 
    </label>
</GridItem>

    
<GridItem col={16} row={5}>
    <Input maxLength={1} name='action' id='action' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={18} row={5}>
    <label style={{color:"neutral"}}>
         1.  Display/Delete/Update CUSTOMER information 
    </label>
</GridItem>

    
<GridItem col={18} row={6}>
    <label style={{color:"neutral"}}>
         2.  Display/Delete ACCOUNT information 
    </label>
</GridItem>

    
<GridItem col={18} row={7}>
    <label style={{color:"neutral"}}>
         3.  Create CUSTOMER 
    </label>
</GridItem>

    
<GridItem col={18} row={8}>
    <label style={{color:"neutral"}}>
         4.  Create ACCOUNT 
    </label>
</GridItem>

    
<GridItem col={18} row={9}>
    <label style={{color:"neutral"}}>
         5.  Update ACCOUNT 
    </label>
</GridItem>

    
<GridItem col={18} row={10}>
    <label style={{color:"neutral"}}>
         6.  Credit/Debit funds to an ACCOUNT 
    </label>
</GridItem>

    
<GridItem col={18} row={11}>
    <label style={{color:"neutral"}}>
         7.  Transfer funds 
    </label>
</GridItem>

    
<GridItem col={18} row={13}>
    <label style={{color:"neutral"}}>
         A.  Look up Accounts with Customer Number 
    </label>
</GridItem>

    
<GridItem col={1} row={23}>
    <label style={{color:"yellow"}}>
         {receivedData.message } 
    </label>
</GridItem>

    
<GridItem col={1} row={24}>
    <label style={{color:"blue"}}>
         F3=Exit   F12=Cancel 
    </label>
</GridItem>

    
<GridItem col={79} row={24}>
    <label >
         {receivedData.dummy } 
    </label>
</GridItem>

    
    </>
  );
}
    