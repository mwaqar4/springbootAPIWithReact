import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { API_URL } from '../utils/constants';
import Modal from 'react-awesome-modal';
const closeIcon = require("../icons/close.png")



const App = (props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [companiesList, setCompaniesList] = useState([]);
  const [loader, setLoader] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalView, setModalView] = useState("")
  const [idToUpdate, setIdToUpdate] = useState(0)
  const [modalError, setModalError] = useState('')
  const inputNameRef = useRef();

  
  useEffect(()=>{
    getAllCompanies()
  },[])

  const getAllCompanies = async() => {
    try {
      setLoader(true)
      const { data } = await axios.get(`${API_URL}/api/v1/companies`);
      setErrorMsg('');
      setCompaniesList(data.content);
      setLoader(false)
    } catch (error) {
      error.response && setErrorMsg(error);
    }
  }

  const updateCompany = async() => {
    if(inputNameRef.current.value === ''){
      setModalError("Enter name")
    }
    else{
      let data = {
        "name": inputNameRef.current.value,
        "employees" : []
       }
      await axios.put(`${API_URL}/api/v1/companies/`+idToUpdate, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      getAllCompanies()
      closeModal()
    }

  }

  const deleteCompany = async(id) => {
    await axios.delete(`${API_URL}/api/v1/companies/`+id)
    getAllCompanies()
  }

  const addCompany = async() => {
    if(inputNameRef.current.value === ''){
      setModalError("Enter name")
    }
    else{
      let data = {
        "name": inputNameRef.current.value,
        "employees" : []
       }
      await axios.post(`${API_URL}/api/v1/companies`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      getAllCompanies()
      closeModal()
    }
  }

  const openModal = (context, id) => {
    if(context.match("add")){
      setModalView("add")
    }
    else{
      setIdToUpdate(id);
      setModalView("update")
    }
    setModalVisible(true)
  }

  const closeModal= () =>{
    setModalVisible(false)
    setModalView("")
    setModalError('')

      
  }

  return (
    <>
    <div className={loader?"loader":''} style={{position: 'fixed',left: '50%', top: '50%'}}></div>

    <div id="modal-container">
    {modalView === "add"?
        <Modal visible={modalVisible} width="400" height="300" effect="fadeInUp" onClickAway={() => closeModal()}>
            <div className='modal-inner'>
              <div className='modal-header'>
                <p className='modal-title'>Add Company</p>
                  <img className='modal-close' src={closeIcon} onClick={()=>closeModal()}/>
              </div>
              <div className='modal-body'>
                <p>Enter company name:</p>
                <input style={{width:"100%"}} type="text" ref={inputNameRef}></input>
                <Button style={{marginTop:"5px"}} onClick={() =>  addCompany()}>Add</Button>
              </div>
            </div>
        </Modal>
        :(
          modalView === "update"?
            <Modal visible={modalVisible} width="400" height="300" effect="fadeInUp" onClickAway={() => closeModal()}>
              <div className='modal-inner'>
                <div className='modal-header'>
                  <p className='modal-title'>Update Company</p>
                    <img className='modal-close' src={closeIcon} onClick={()=>closeModal()}/>
                </div>
                <div className='modal-body'>
                  <p>Enter company name:</p>
                  <input style={{width:"100%"}} type="text" ref={inputNameRef}></input>
                  <Button style={{marginTop:"5px"}} onClick={() =>  updateCompany()}>Update</Button>
                </div>
              </div>
          </Modal>
          :
          <></>

        )
      }
      <div className="modal-background">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Button style={{margin:'10px'}} onClick={() => openModal("add")}>Add Company</Button>
        <table className="docs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>

            </tr>
          </thead>
          <tbody>
            {companiesList.length > 0 ? (
              companiesList.map(
                ({ id, name }) => (
                  <tr key={id}>
                    <td className="document-title">{id}</td>
                    <td className="document-description">{name}</td>
                    <td className="document-description" onClick={() =>openModal("update", id)}>
                      <a style={{alignSelf:'center', justifySelf:'center'}}
                        href="#/">
                        Update
                      </a>
                    </td>
                    <td className="document-description" onClick={() =>deleteCompany(id)}>
                      <a style={{alignSelf:'center', justifySelf:'center'}}
                        href="#/">
                        Delete
                      </a>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={3} style={{ fontWeight: '300' }}>
                  No Companies found. Please add some.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default App;
