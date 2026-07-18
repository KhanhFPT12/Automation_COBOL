
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';


export default function FILE1() {


    type formInput = {
        f1libl: string,
f1text: string,
f1symk: string,
f1yot1: string,
f1yot2: string,
f1yot3: string,
f1yot4: string,
f1bik1: string,
f1bik2: string,
f1bik3: string,
f1bik4: string,
f1syyy: string,
f1symm: string,
f1sydd: string,
f1tape: string,
f2tape: string,
f3tape: string,
f4tape: string,
f1tpno: string,

    }

    type formOutput = {
        f1libl: string,
f1synm: string,
f1text: string,
f1symk: string,
f1yot1: string,
f1yot2: string,
f1yot3: string,
f1yot4: string,
f1bik1: string,
f1bik2: string,
f1bik3: string,
f1bik4: string,
f1syyy: string,
f1symm: string,
f1sydd: string,
f1tape: string,
f2tape: string,
f3tape: string,
f4tape: string,
f1tpno: string,
f1msg: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        f1libl: '',
f1text: '',
f1symk: '',
f1yot1: '',
f1yot2: '',
f1yot3: '',
f1yot4: '',
f1bik1: '',
f1bik2: '',
f1bik3: '',
f1bik4: '',
f1syyy: '',
f1symm: '',
f1sydd: '',
f1tape: '',
f2tape: '',
f3tape: '',
f4tape: '',
f1tpno: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        f1libl: '',
f1synm: '',
f1text: '',
f1symk: '',
f1yot1: '',
f1yot2: '',
f1yot3: '',
f1yot4: '',
f1bik1: '',
f1bik2: '',
f1bik3: '',
f1bik4: '',
f1syyy: '',
f1symm: '',
f1sydd: '',
f1tape: '',
f2tape: '',
f3tape: '',
f4tape: '',
f1tpno: '',
f1msg: '',

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
        httpConfig.domain + '/File1',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
    <Helmet>
        <title>FILE1</title>
    </Helmet>
     
        <GridItem col={3} row={1}>
            <label >
                登　録
            </label>
        </GridItem>
            
        <GridItem col={27} row={1}>
            <label >
                ライブラリー申請登録
            </label>
        </GridItem>
            
        <GridItem col={58} row={1}>
            <label >
                
            </label>
        </GridItem>
            
        <GridItem col={71} row={1}>
            <label >
                入　力
            </label>
        </GridItem>
            
        <GridItem col={71} row={1}>
            <label >
                確　認
            </label>
        </GridItem>
            
        <GridItem col={71} row={1}>
            <label >
                処理中
            </label>
        </GridItem>
            
        <GridItem col={5} row={3}>
            <label >
                ライブラリー：
            </label>
        </GridItem>
            
        <GridItem col={22} row={3}>
            <Input maxLength={10} id='f1libl' name='f1libl' value={formData.f1libl } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={36} row={3}>
            <label >
                申請者：
            </label>
        </GridItem>
            
        <GridItem col={47} row={3}>
            <label id='f1synm'>
                {receivedData.f1synm }
            </label>
        </GridItem>
            
        <GridItem col={5} row={5}>
            <label >
                テキスト記述：
            </label>
        </GridItem>
            
        <GridItem col={22} row={5}>
            <Input maxLength={50} id='f1text' name='f1text' value={formData.f1text } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={5} row={7}>
            <label >
                使用目的　　：
            </label>
        </GridItem>
            
        <GridItem col={22} row={7}>
            <Input maxLength={1} id='f1symk' name='f1symk' value={formData.f1symk } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={25} row={7}>
            <label >
                1.本番用
            </label>
        </GridItem>
            
        <GridItem col={36} row={7}>
            <label >
                2.開発用
            </label>
        </GridItem>
            
        <GridItem col={47} row={7}>
            <label >
                3.テスト用
            </label>
        </GridItem>
            
        <GridItem col={60} row={7}>
            <label >
                4.移行用
            </label>
        </GridItem>
            
        <GridItem col={71} row={7}>
            <label >
                5.他
            </label>
        </GridItem>
            
        <GridItem col={5} row={9}>
            <label >
                用　　途　　：
            </label>
        </GridItem>
            
        <GridItem col={22} row={9}>
            <Input maxLength={52} id='f1yot1' name='f1yot1' value={formData.f1yot1 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={22} row={10}>
            <Input maxLength={52} id='f1yot2' name='f1yot2' value={formData.f1yot2 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={22} row={11}>
            <Input maxLength={52} id='f1yot3' name='f1yot3' value={formData.f1yot3 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={22} row={12}>
            <Input maxLength={50} id='f1yot4' name='f1yot4' value={formData.f1yot4 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={5} row={13}>
            <label >
                備　　考　　：
            </label>
        </GridItem>
            
        <GridItem col={22} row={13}>
            <Input maxLength={52} id='f1bik1' name='f1bik1' value={formData.f1bik1 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={22} row={14}>
            <Input maxLength={52} id='f1bik2' name='f1bik2' value={formData.f1bik2 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={22} row={15}>
            <Input maxLength={52} id='f1bik3' name='f1bik3' value={formData.f1bik3 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={22} row={16}>
            <Input maxLength={50} id='f1bik4' name='f1bik4' value={formData.f1bik4 } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={5} row={18}>
            <label >
                使用期限　　：
            </label>
        </GridItem>
            
        <GridItem col={22} row={18}>
            <Input maxLength={4} id='f1syyy' name='f1syyy' value={formData.f1syyy } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={27} row={18}>
            <label >
                年
            </label>
        </GridItem>
            
        <GridItem col={32} row={18}>
            <Input maxLength={2} id='f1symm' name='f1symm' value={formData.f1symm } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={35} row={18}>
            <label >
                月
            </label>
        </GridItem>
            
        <GridItem col={40} row={18}>
            <Input maxLength={2} id='f1sydd' name='f1sydd' value={formData.f1sydd } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={43} row={18}>
            <label >
                日
            </label>
        </GridItem>
            
        <GridItem col={5} row={20}>
            <label >
                テープ保管　：日次　週次　月次　削除前
            </label>
        </GridItem>
            
        <GridItem col={6} row={21}>
            <label >
                (1.対象)
            </label>
        </GridItem>
            
        <GridItem col={23} row={21}>
            <Input maxLength={1} id='f1tape' name='f1tape' value={formData.f1tape } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={29} row={21}>
            <Input maxLength={1} id='f2tape' name='f2tape' value={formData.f2tape } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={35} row={21}>
            <Input maxLength={1} id='f3tape' name='f3tape' value={formData.f3tape } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={41} row={21}>
            <Input maxLength={1} id='f4tape' name='f4tape' value={formData.f4tape } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={47} row={21}>
            <label >
                保管テープ№：
            </label>
        </GridItem>
            
        <GridItem col={64} row={21}>
            <Input maxLength={10} id='f1tpno' name='f1tpno' value={formData.f1tpno } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={3} row={23}>
            <label >
                F1再入力
            </label>
        </GridItem>
            
        <GridItem col={16} row={23}>
            <label >
                F10取消し
            </label>
        </GridItem>
            
        <GridItem col={2} row={24}>
            <label id='f1msg'>
                {receivedData.f1msg }
            </label>
        </GridItem>
            
    </>
  );
}
    