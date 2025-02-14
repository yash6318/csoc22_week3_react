/* eslint-disable @next/next/no-img-element */

import axios from "../utils/axios";
import { useState } from "react";
import { useAuth } from "../context/auth";
import { API_URL} from "../utils/constants"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from "next/router";


export default function TodoListItem(props) {
  const [isEditActive,setEditActive] = useState(false);
  const [todo,setTodo] = useState('');
  const {token} = useAuth();
  
  const editTask = () => {
    
    setEditActive(true);
  }

  const deleteTask = (id) => {
    
    axios.delete(
      'todo/'+id+'/',
      {
        headers: {
          Authorization: 'Token ' + token,
        }
      }
    ).then(()=>{
      toast.success('Task Deleted!',{position:"bottom-right",theme:"colored"})
    })
    .catch((err)=>{
      console.log(err);
      toast.error('Some error Occured!',{position:"bottom-right",theme:"colored"});
    })
  }

  const updateTask = (id) => {
    
    if(token){

      axios({
        headers : {Authorization : "Token " + token},
        url : API_URL + 'todo/' + id + '/',
        method : 'patch',
        data : {title : todo}
      }).then((res)=>{
        setEditActive(false)
        toast.success('Task updated!',{position:"bottom-right",theme:"colored"})
      })
      .catch((err)=>{
        console.log(err);
        toast.error('Some error Occured!',{position:"bottom-right",theme:"colored"});;
      })
      
    }
    else {
      toast.warn('Token not present',{position:"top-center",theme:"colored"});
      toast.info('Please login to continue..',{position:"top-center",theme:"colored"})
      router.push('/login');
    }
    
      
  }

  return (
    <>
      <li className='border flex border-gray-500 rounded px-2 py-2 justify-between items-center mb-2'>
        <input
          id={'input-button-'+props.id}
          type='text'
          className={isEditActive?'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring  todo-edit-task-input':'hideme'}
          placeholder='Edit The Task'
          value={todo}
          onChange={(e)=>{setTodo(e.target.value)}}
        />
        <div id={'done-button-'+props.id} className={isEditActive?'':'hideme'}>
          <button
            className='bg-transparent hover:bg-gray-500 text-gray-700 text-sm  hover:text-white py-2 px-3 border border-gray-500 hover:border-transparent rounded todo-update-task'
            type='button'
            onClick={()=>updateTask(props.id)}
          >
            Done
          </button>
        </div>
        <div id={'task-'+props.id} className={isEditActive ? 'hideme':'todo-task  text-gray-600'}>
          {props.title}
        </div>
        <span id={'task-actions-'+props.id} className={isEditActive?'hideme':''}>
          <button
            style={{ marginRight: '5px' }}
            type='button'
            onClick={editTask}
            className='bg-transparent hover:bg-yellow-500 hover:text-white border border-yellow-500 hover:border-transparent rounded px-2 py-2'
          >
            <img
              src='https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png'
              width='18px'
              height='20px'
              alt='Edit'
            />
          </button>
          <button
            type='button'
            className='bg-transparent hover:bg-red-500 hover:text-white border border-red-500 hover:border-transparent rounded px-2 py-2'
            onClick={()=> deleteTask(props.id)}
          >
            <img
              src='https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg'
              width='18px'
              height='22px'
              alt='Delete'
            />
          </button>
        </span>
      </li>
    </>
  )
}
