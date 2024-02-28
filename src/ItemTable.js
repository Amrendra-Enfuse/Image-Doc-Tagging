import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { userColumns } from "./columns";
import { useTableSearch } from "./useTableSearch";
import DetailsPage from "./DetailsPage";
import { useNavigate, useLocation } from "react-router-dom";
const port = 5555;

const { Search } = Input;

const Data =
    [
        {
            "root": "project one",
            "task": "task one",
            "data": [{
                "id": 1,
                "name": "folder one",
                "image": "02",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "20",
                "annotationStatus": "Reviewing",
                "url":'http://xyz.com'
            }, {
                "id": 2,
                "name": "folder two",
                "image": "01",
                "status": "todo",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "10",
                "annotationStatus": "todo",
                "url":'http://xyz.com'
            },]
        },
        {
            "root": "project two",
            "task": "task two",
            "data": [{
                "id": 1,
                "name": "folder three",
                "image": "01",
                "status": "todo",
                "TypeOfBoundingBox": "polygone",
                "numberOfBoundingBox": "14",
                "annotationStatus": "todo",
                "url":'http://xyz.com'
            }, {
                "id": 2,
                "name": "folder four",
                "image": "02",
                "status": "Review",
                "TypeOfBoundingBox": "polygone",
                "numberOfBoundingBox": "20",
                "annotationStatus": "Reviewed",
                "url":'http://xyz.com'
            },]
        }
    ];

const fetchUsers = async () => {
    // const { data } = await axios.get(
    //   "https://jsonplaceholder.typicode.com/users/"
    // );
    // return { data };
};
export default function ItemTable() {
    const [searchVal, setSearchVal] = useState(null);
    const [info,setInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentURL = location.pathname;
    const defualtDataSet = [{
        "root": "",
        "task": "",
        "data": [{
            "id": '',
            "name": "",
            "image": "",
            "status": "To Do",
            "TypeOfBoundingBox": "",
            "numberOfBoundingBox": "",
            "annotationStatus": "",
            "url":''
        }],
    }];
    let [dataV, setDataV] = useState(defualtDataSet);

    const handleNavigate = (arg, Initem, item) => {
        // setInfo(data)
        let data = arg.split('/'); 
        console.log(Initem);
        const dynamicRoute = `/${data[1]}/${data[2]}/${data[3]}/${item.root.replace(' ','')}/${item.task.replace(' ','')}/${Initem.name.replace(' ','')}/detail`;

        // navigate(dynamicRoute);
        navigate(dynamicRoute, { state: { info: Initem } });
        console.log('>>>>>>', dynamicRoute);
    }
    const datastyle = { padding: '10px 20px',fontSize:'13px' };
    useEffect(() => {
        let urlvalue = currentURL.split('/');
        axios.get(`http://localhost:${port}/api/tag/rect/fetch`, {
            params: {
                taggerId: urlvalue[1]
            }
        }).then((res) => {
            console.log(res.data);
            setDataV([{
                "root": `${res.data.project_name}`,
                "task": `${res.data.folder_name}`,
                "data": [{
                    "id": `${res.data.task_id}`,
                    "name": `${res.data.folder_name}`,
                    "image": 1,
                    "status": "To Do",
                    "TypeOfBoundingBox": "Rectangle",
                    "numberOfBoundingBox": 0,
                    "annotationStatus": "To Do",
                    "url":`${res.data.task_filepath}`
                }]
            }])
        }).catch(error => {
            console.log(error);
        });
    }, []);
    //console.log(dataV)
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', width: '80%', maxWidth: '800px' }}>
                <>
                    <Search
                        onChange={e => setSearchVal(e.target.value)}
                        placeholder="Search"
                        enterButton
                        style={{display:`${info?'none':'block'}`, position: "sticky", top: "0", left: "0" }}
                    />
                    <br /> <br />
                  
                    <table style={{display:`${info?'none':'block'}`, backgroundColor: 'white', borderRadius: '7px' }}>
                        
                            <thead style={datastyle}>
                                <tr>
                                    <th style={datastyle}>Project Name</th>
                                    <th colSpan={4}>
                                        <table width={"250%"}><tbody>
                                            <tr>
                                                <th>Folder Name</th>
                                                <th>Images</th>
                                                <th>Annotations</th>
                                                <th>Status</th>
                                            </tr>
                                        </tbody></table>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataV.map((item, ind) => {
                                    return(
                                        <tr key={ind}>
                                            <td style={{datastyle}}>{item.root}</td><td colSpan={4}>
                                                {item.data.map((innerItem,InnerInd)=>{
                                                    return(
                                                        <table key={innerItem.id} width={"250%"}><tbody>
                                                            <tr>
                                                                <td className="bi bi-folder" style={{datastyle, cursor:'pointer'}}  onClick={() => handleNavigate(currentURL, innerItem, item)} width={'35%'}>{innerItem.name}</td>
                                                                <td style={datastyle} width={"20%"}>{innerItem.image}</td>
                                                                <td width={"30%"}>{innerItem.numberOfBoundingBox}</td>
                                                                <td >{innerItem.status}</td>
                                                            </tr>
                                                        </tbody></table>
                                                    )})}
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </>
            </div>
        </div>
    );
}