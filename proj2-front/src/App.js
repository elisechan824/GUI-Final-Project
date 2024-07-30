/*
 * Project 1
 * App component JavaScript source code
 *
 * Author: Elise Chan (elisechan824)
 * Version: 2.0
 */

import './App.css';
import React, {useState, useEffect} from 'react';
import Item from './Item.js';
import MenuBar from './MenuBar';
import BarChart from './BarChart';
import Editor from './Editor';
import {Box, Container} from "@mui/system";
import axios from 'axios';


const App = (props) => {
    const [key, setKey] = useState('p1.json'); //LocalStorage key
    const [id, setID] = useState([]); // [{'filename':'oid'}]
    const [value, setValue] = useState(null); //Dataset
    const [dataSize, setDataSize] = useState(0); //Size of data
    const [selected, setSelected] = React.useState([]); //Selected elements
    const [copied, setCopied] = React.useState([]); //Selected elements
    const [isInitialized, setIsInitialized] = useState(false);
    const [isNewDataset, setIsNewDataset] = useState(false); //flag for if dataset is new

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            document.title = 'Project 2: elisechan824';
            refreshData()
        }
    }, []);

    // clear local storage, pull most recent data from mongodb, re-populate localStorage
    const refreshData = () => {
        axios.get('http://localhost:3000/db/find').then(res => {
            localStorage.clear();
            console.log(localStorage)
            console.log(res)
            res.data.map((item, i) => {
                const contentAndOID = {
                    _id: item._id,
                    ...item.fileContent,
                };
                localStorage.setItem(item.fileName, JSON.stringify(contentAndOID))
                console.log(contentAndOID)
            });
        });
    }

    //Load File
    const loadDataset = (fileName) => {
        refreshData();
        setIsNewDataset(false);
        setKey(fileName);
        let val = JSON.parse(localStorage[fileName])
        console.log(val)
        if(val.data.length === 0){
            val.data.push({'x': '', 'y': 0});
        }
        console.log(val)
        setValue(val);
        setDataSize(val.data.length);
        setSelected([]);
    }

    //Open New File
    const newDataset = (fileName) => {
        setKey(fileName);
        let val = {
            title: fileName,
            data: [{'x': '', 'y': 0}],
        };
        setValue(val);
        setDataSize(val.data.length);
        setSelected([]);
        setIsNewDataset(true);
        console.log(value)
    }

    //Save Current File
    const saveDataset = () => {
        localStorage[key] = JSON.stringify(value);
        console.log(isNewDataset)
        console.log(key)

        // save: overwrite if existing dataset, add new entry to database if new
        if(isNewDataset) {
            axios.post('http://localhost:3000/db/postNew/', {
            'fileName':key, 
            'fileContent':{
                title: value.title, 
                data:value.data
            }                
        })
        }
        else {
            let tempID = JSON.parse(localStorage[key])['_id']
            console.log(tempID)
            axios.post('http://localhost:3000/db/update/' + tempID, {'title': value.title, 'data':value.data})
            .then(res => {
                console.log("success");
                console.log(res.data);
            })
        }
        setIsNewDataset(false);
    }

    //Save File with new name
    const saveAsDataset = (fileName) => {
        setKey(fileName);
        console.log(value)
        axios.post('http://localhost:3000/db/postNew/', {
            'fileName':fileName, 
            'fileContent':{
                title: value.title, 
                data:value.data
            }                
        })
        .then(response => {
            console.log(response)
            value._id = response.data['_id']
            setValue(value)
            localStorage.setItem(fileName, JSON.stringify(value));

        })
        .catch(error => {
            console.error('Error posting to server:', error);
        });
        setDataSize(value.data.length);
        setIsNewDataset(false);
    }

    const cut = (e) => {
        setCopied([])
        let tempCutVals = []
        for(let i = 0; i < selected.length; i++) {
            tempCutVals.push(value['data'][selected[i]])
        }
        console.log(tempCutVals.length)
        if(tempCutVals.length != 0) {
            setCopied(tempCutVals)
            console.log(tempCutVals)

            let tempFullData = value['data'];
            tempFullData = tempFullData.filter((x, i, arr) => {return !selected.includes(i)});
            if(tempFullData.length === 0){
                let c1 = Object.keys(value.data[0])[0];
                let c2 = Object.keys(value.data[0])[1];
                tempFullData.push({[c1]: '', [c2]: 0});
            }
            let tempValue = {id: value._id, title: value.title, data: tempFullData};

            console.log(tempValue)
            setValue(tempValue)
        }
        
        setSelected([])
    }

    const copy = () => {
        setCopied([])
        let tempCopyVals = []
        for(let i = 0; i < selected.length; i++) {
            console.log(value['data'][selected[i]])
            tempCopyVals.push(value['data'][selected[i]])
        }
        setCopied(tempCopyVals)
        setSelected([])
    }

    const paste = () => {
        let tempFullData = value['data']
        for( let i = 0; i < copied.length; i++) {
            value['data'].push(copied[i])
        }
        let tempValue = {id: value._id, title: value.title, data: tempFullData};
        setValue(tempValue)
        setDataSize(value['data'].length)
        setSelected([])

    }

    //Change Chart Title
    const changeTitle = (e) => {
        if(value == null) {
            setKey("defaultKey");
            let val = {
                title: "",
                data: [{'x': '', 'y': 0}],
            };
            setValue(val);
            setDataSize(val.data.length);
            setSelected([]);
            setIsNewDataset(true);
        }
        else {
            value.title = e.target.value
            setValue(value);
        }
        setDataSize(dataSize+1);
        console.log(value);
    }
    

    //Change X label
    const changeXLabel = (e) => {
        let newValue = value;
        newValue.data = value.data.map(
            (x, i)=>
            {return {[e.target.value] : Object.values(value.data[i])[0], [Object.keys(value.data[0])[1]] : Object.values(value.data[i])[1]}}
        );
        setValue(newValue);
        setDataSize(dataSize+1);
        console.log(value);
    }

    //Change Y Label
    const changeYLabel = (e) => {
        let newValue = value;
        newValue.data = value.data.map(
            (x, i)=>
            {return {[Object.keys(value.data[0])[0]] : Object.values(value.data[i])[0], [e.target.value] : Object.values(value.data[i])[1]}}
        );
        setValue(newValue);
        setDataSize(dataSize+1);
        console.log(value);
    }

    //Add a new row
    const addElement = (newX, newY) => {
        console.log(dataSize);
        let c1 = Object.keys(value.data[0])[0];
        let c2 = Object.keys(value.data[0])[1];
        const newRow = {[c1]:newX, [c2]:newY};
        value.data.push(newRow);
        setDataSize(dataSize+1);
        console.log(dataSize);
        setValue(value);
    };

    //Delete a row
    const deleteElement = (index) => {
        if (value.data.length > 1) {
            let newValue = value;
            newValue.data = value.data.filter((x, i, arr) => {return i !== index});
            setValue(newValue);
            console.log(newValue);
            setDataSize(newValue.data.length);
        }
    };

    //Edit a row
    const editElement = (newVal, index, xVal) => {
        console.log('Edit Elem: ', index, newVal, xVal);
        let c1 = Object.keys(value.data[0])[0];
        let c2 = Object.keys(value.data[0])[1];
        xVal ? value.data[index][c1] = newVal : value.data[index][c2] = newVal;
        setDataSize(dataSize+1);
        setValue(value);
        console.log(value);
    };

    //Select with checkboxes
    const selectElement = (e, index) => {
        if(e.target.checked) {
            console.log('Checked: ' + index);
            selected.push(index);
            if(index === -1){
                for (let i = 0; i < value.data.length; i ++){
                    if (selected.indexOf(i) === -1){
                        selected.push(i);
                    }
                }
            }
            setSelected(selected);
        }
        else{
            console.log('Unchecked: ' + index);
            if (index === -1){
                setSelected([]);
            }
            else {
                let newSelected = selected.filter((value, i, arr) => {return value !== index})
                setSelected(newSelected);
            }
        }
        setDataSize(dataSize+1);
        console.log(selected)
    };

    return (
        <Container className="App" >
            <MenuBar
                loadHandler={loadDataset}
                newFileHandler={newDataset}
                saveHandler={saveDataset}
                saveAsHandler={saveAsDataset}
                cutHandler={cut}
                copyHandler={copy}
                pasteHandler={paste}
            >
            </MenuBar>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} >
                <Item>
                    <Editor
                        dataset={value}
                        sx={{bgcolor: 'white', width: '100%', height: '100%'}}
                        addElementHandler={addElement}
                        deleteElementHandler={deleteElement}
                        editElementHandler={editElement}
                        selected={selected}
                        selectHandler={selectElement}
                        titleHandler={changeTitle}
                        xLabelHandler={changeXLabel}
                        yLabelHandler={changeYLabel}
                    />
                </Item>
                <Item>
                <BarChart 
                    dataset={value}
                    selected={selected}
                    selectHandler={selectElement}
                    value={value}
                    sx={{bgcolor: 'white', width: '100%', height: '100%'}}>
                </BarChart>
                </Item>
            </Box>
        </Container>
    );

}

export default App;
