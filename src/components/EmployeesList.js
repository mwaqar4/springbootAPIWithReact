import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { Form, Button } from 'react-bootstrap';
import Modal from 'react-awesome-modal';
const closeIcon = require("../icons/close.png")



const EmployeesList = (props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [employeesList, setEmployeesList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
  const [modalView, setModalView] = useState("")
  const [idToUpdate, setIdToUpdate] = useState(0)
  const [modalError, setModalError] = useState('')

  const inputNameRef = useRef();
  const inputSurnameRef = useRef();
  const inputEmailRef = useRef();
  const inputAddressRef = useRef();
  const inputSalaryRef = useRef();
  const inputCompanyRef = useRef();




  
  useEffect(()=>{
    getAllEmployees()
  },[])

  const getAllEmployees = async() => {
    try {
      setLoader(true)
      const {data} = await axios.get(`${API_URL}/api/v1/employees`);
      setErrorMsg('');
      data.forEach(
        e =>{
          getCompanyName(e)
        }
      )
      setLoader(false)
    } catch (error) {
      error.response && setErrorMsg(error);
    }
  }

  const getCompanyName = async(e) => {
    try{
      const { data } = await axios.get(`${API_URL}/api/v1/companies/${e.jsonCompanyId}`);
      const companyObject = {"companyName":data.name}
      const employeeData = {...e, ...companyObject}
      setEmployeesList(prevData => [...prevData ,employeeData]);
      setLoader(false)
    }
    catch(error){
      error.response && setErrorMsg(error)
    }
  }

  const updateEmployee = async() => {
    if(inputNameRef.current.value === ''){
      setModalError("Enter name")
    }
    else if(inputCompanyRef.current.value === ''){
      setModalError("Enter company name")
    }
    else{
      let data = {
        "name": inputNameRef.current.value,
        "surname": inputSurnameRef.current.value,
        "email": inputEmailRef.current.value,
        "address": inputAddressRef.current.value,
        "salary": inputSalaryRef.current.value,
        "company" : {
            "name": inputCompanyRef.current.value
        }
      }
      await axios.put(`${API_URL}/api/v1/employees/`+idToUpdate, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      closeModal()
      props.history.push('/');
      props.history.push('/list');
    }

  }

  const deleteEmployee = async(id) => {
    await axios.delete(`${API_URL}/api/v1/employees/`+id)
    props.history.push('/');
    props.history.push('/list');
  }

  const addEmployee = async() => {
    if(inputNameRef.current.value === ''){
      setModalError("Enter name")
    }
    else if(inputCompanyRef.current.value === ''){
      setModalError("Enter company name")
    }
    else{
      let data = {
        "name": inputNameRef.current.value,
        "surname": inputSurnameRef.current.value,
        "email": inputEmailRef.current.value,
        "address": inputAddressRef.current.value,
        "salary":  parseFloat(inputSalaryRef.current.value),
        "company" : {
            "name": inputCompanyRef.current.value
        }
      }
      await axios.post(`${API_URL}/api/v1/employees`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      closeModal()
      props.history.push('/');
      props.history.push('/list');
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
        <Modal visible={modalVisible} width="700" height="600" effect="fadeInUp" onClickAway={() => closeModal()}>
            <div className='modal-inner'>
              <div className='modal-header'>
                <p className='modal-title'>Add Employee</p>
                  <img className='modal-close' src={closeIcon} onClick={()=>closeModal()}/>
              </div>
              <div className='modal-body'>
                <div style={{display:'flex', width:'100%', margin:'5px'}}>
                  <p style={{width:'30%'}}>Enter employee name:</p>
                  <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputNameRef}></input>
                </div>
                <div style={{display:'flex', width:'100%', margin:'5px'}}>
                  <p style={{width:'30%'}}>Enter surname:</p>
                  <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputSurnameRef}></input>
                </div>
                <div style={{display:'flex', width:'100%', margin:'5px'}}>
                  <p style={{width:'30%'}}>Enter email:</p>
                  <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputEmailRef}></input>
                </div>
                <div style={{display:'flex', width:'100%', margin:'5px'}}>
                  <p style={{width:'30%'}}>Enter address:</p>
                  <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputAddressRef}></input>
                </div>
                <div style={{display:'flex', width:'100%', margin:'5px'}}>
                  <p style={{width:'30%'}}>Enter salary:</p>
                  <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputSalaryRef}></input>
                </div>
                <div style={{display:'flex', width:'100%', margin:'5px'}}>
                  <p style={{width:'30%'}}>Enter company name:</p>
                  <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputCompanyRef}></input>
                </div>
                {modalError && <p className="errorMsg">{modalError}</p>}
                <Button style={{marginTop:"5px"}} onClick={() =>  addEmployee()}>Add</Button>
              </div>
            </div>
        </Modal>
        :(
          modalView === "update"?
            <Modal visible={modalVisible} width="700" height="600" effect="fadeInUp" onClickAway={() => closeModal()}>
              <div className='modal-inner'>
                <div className='modal-header'>
                  <p className='modal-title'>Update Employee</p>
                    <img className='modal-close' src={closeIcon} onClick={()=>closeModal()}/>
                </div>
                <div className='modal-body'>
                  <div style={{display:'flex', width:'100%', margin:'5px'}}>
                    <p style={{width:'30%'}}>Enter employee name:</p>
                    <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputNameRef}></input>
                  </div>
                  <div style={{display:'flex', width:'100%', margin:'5px'}}>
                    <p style={{width:'30%'}}>Enter surname:</p>
                    <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputSurnameRef}></input>
                  </div>
                  <div style={{display:'flex', width:'100%', margin:'5px'}}>
                    <p style={{width:'30%'}}>Enter email:</p>
                    <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputEmailRef}></input>
                  </div>
                  <div style={{display:'flex', width:'100%', margin:'5px'}}>
                    <p style={{width:'30%'}}>Enter address:</p>
                    <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputAddressRef}></input>
                  </div>
                  <div style={{display:'flex', width:'100%', margin:'5px'}}>
                    <p style={{width:'30%'}}>Enter salary:</p>
                    <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputSalaryRef}></input>
                  </div>
                  <div style={{display:'flex', width:'100%', margin:'5px'}}>
                    <p style={{width:'30%'}}>Enter company name:</p>
                    <input style={{marginLeft:"5px", width:"70%"}} type="text" ref={inputCompanyRef}></input>
                  </div>
                  {modalError && <p className="errorMsg">{modalError}</p>}
                  <Button style={{marginTop:"5px"}} onClick={() =>  updateEmployee()}>Update</Button>
                </div>
              </div>
          </Modal>
          :
          <></>

        )
      }
      <div className="modal-background">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Button style={{margin:'10px'}} onClick={() => openModal("add")}>Add Employee</Button>
        <table className="docs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Company Name</th>
            </tr>
          </thead>
          <tbody>
            {employeesList.length > 0 ? (

              employeesList.map(
                ({ id, name, surname, email, address, salary, companyName }) => (
                  <tr key={id}>
                    <td className="document-title">{id}</td>
                    <td className="document-description">{name}</td>
                    <td className="document-description">{surname}</td>
                    <td className="document-description">{email}</td>
                    <td className="document-description">{address}</td>
                    <td className="document-description">{salary}</td>
                    <td className="document-description">{companyName}</td>

                    <td className="document-description" onClick={() =>openModal("update",id)}>
                      <a style={{alignSelf:'center', justifySelf:'center'}}
                        href="#/">
                        Update
                      </a>
                    </td>
                    <td className="document-description" onClick={() =>deleteEmployee(id)}>
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
                  No Employee found. Please add some.
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


export default EmployeesList;
