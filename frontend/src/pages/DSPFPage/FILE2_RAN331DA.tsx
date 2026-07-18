
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';


export default function FILE2_RAN331DA() {


    type formInput = {
        dtokc1: string,
dtokc2: string,
dtodc2: string,
dkbn: string,
dtokc3: string,

    }

    type formOutput = {
        wdate: string,
wname: string,
dtokc1: string,
dtokc2: string,
dtodc2: string,
dkbn: string,
dtokc3: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        dtokc1: '',
dtokc2: '',
dtodc2: '',
dkbn: '',
dtokc3: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        wdate: '',
wname: '',
dtokc1: '',
dtokc2: '',
dtodc2: '',
dkbn: '',
dtokc3: '',

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
        httpConfig.domain + '/File2_ran331da',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
    <Helmet>
        <title>FILE2_RAN331DA</title>
    </Helmet>
     
        <GridItem col={2} row={1}>
            <label id='wdate'>
                {receivedData.wdate }
            </label>
        </GridItem>
            
        <GridItem col={12} row={4}>
            <label >
                ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
            </label>
        </GridItem>
            
        <GridItem col={12} row={5}>
            <label >
                ＊
            </label>
        </GridItem>
            
        <GridItem col={66} row={5}>
            <label >
                ＊
            </label>
        </GridItem>
            
        <GridItem col={12} row={6}>
            <label >
                ＊
            </label>
        </GridItem>
            
        <GridItem col={23} row={6}>
            <label id='wname'>
                {receivedData.wname }
            </label>
        </GridItem>
            
        <GridItem col={66} row={6}>
            <label >
                ＊
            </label>
        </GridItem>
            
        <GridItem col={12} row={7}>
            <label >
                ＊
            </label>
        </GridItem>
            
        <GridItem col={66} row={7}>
            <label >
                ＊
            </label>
        </GridItem>
            
        <GridItem col={12} row={8}>
            <label >
                ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
            </label>
        </GridItem>
            
        <GridItem col={25} row={12}>
            <label >
                  得意先  
            </label>
        </GridItem>
            
        <GridItem col={41} row={12}>
            <Input maxLength={6} id='dtokc1' name='dtokc1' value={formData.dtokc1 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={25} row={12}>
            <label >
                  得意先  
            </label>
        </GridItem>
            
        <GridItem col={41} row={12}>
            <Input maxLength={6} id='dtokc2' name='dtokc2' value={formData.dtokc2 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={25} row={14}>
            <label >
                  届　先  
            </label>
        </GridItem>
            
        <GridItem col={41} row={14}>
            <Input maxLength={4} id='dtodc2' name='dtodc2' value={formData.dtodc2 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={25} row={12}>
            <label >
                  区　分  
            </label>
        </GridItem>
            
        <GridItem col={41} row={12}>
            <Input maxLength={1} id='dkbn' name='dkbn' value={formData.dkbn } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={45} row={12}>
            <label >
                1.デポ 2.倉庫 3.運送会社
            </label>
        </GridItem>
            
        <GridItem col={45} row={13}>
            <label >
                4.外注          5.梱包会社
            </label>
        </GridItem>
            
        <GridItem col={25} row={15}>
            <label >
                  コード  
            </label>
        </GridItem>
            
        <GridItem col={41} row={15}>
            <Input maxLength={6} id='dtokc3' name='dtokc3' value={formData.dtokc3 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={3} row={24}>
            <label >
                PF2 ﾒﾆｭｰ
            </label>
        </GridItem>
            
        <GridItem col={15} row={24}>
            <label >
                PF5得意先
            </label>
        </GridItem>
            
        <GridItem col={28} row={24}>
            <label >
                PF6届先
            </label>
        </GridItem>
            
        <GridItem col={39} row={24}>
            <label >
                PF7業者
            </label>
        </GridItem>
            
        <GridItem col={60} row={24}>
            <label >
                実行：次画面
            </label>
        </GridItem>
            
    </>
  );
}
    