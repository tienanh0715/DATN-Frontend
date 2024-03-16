import { useState } from 'react'
import './multi-style.css'
import { Col, Row, Card, Form, Button, InputGroup  } from '@themesberg/react-bootstrap';

const MultiSelect = (props) => {
    const {data,listSelected,onChangeMultiSelect} = props
    const [search,setSearch] = useState('')
    const [isOpen,setIsOpen]= useState(false)

    // map to parent
    const changeListSelected = (value) => {
        onChangeMultiSelect(value)
    }

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleSelect = (title) => {

        if (!isOpen) {
        document.addEventListener('click', handleOutsideClick, false);
        } else {
        document.removeEventListener('click', handleOutsideClick, false);
        }
        setIsOpen(!isOpen)
        let _listSelected=listSelected
        changeListSelected(_listSelected.concat(title))
        setSearch('')
  }

    const handleRemoveItem = (index) => {
        let _listSelected=listSelected
        _listSelected.splice(index, 1)
        changeListSelected(_listSelected)
        setSearch('')
    }

    const handleOutsideClick = () => {
        handleSelect()
    }

    const filterData = () => {
        let _data = search 
        ? data.filter(item => !listSelected.find(title => item == title))
            .filter(item => item.toLowerCase()
            .includes(search.toLowerCase()))
        : data.filter(item => !listSelected.find(title => item == title))
        return _data
    }

    const convertText=(i)=>{
      let text_right_access
                        switch (i)
                        {
                            case "all":
                                text_right_access="Tất cả"
                                break;
                            case "in_out_manager":
                                text_right_access="Quản lý vào ra khu đô thị"
                                break;
                            case "in_out_host_manager":
                                text_right_access="Quản lý vào ra khu đô thị vào căn hộ của mình"
                                break;
                        }
                        return text_right_access;
    }

    const filteredData = filterData()
    return (
        <>
        <div className='form-select p-0' >
          <div className='selected-list'>
            {listSelected.map((item, index) => (
              <div className='selected-item'>
                <span className=''
                  key={index}
                >
                  {convertText(item)}
                </span>
                <span onClick={() => handleRemoveItem(index)}>
                      <a className="mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="icon icon-xs text-danger"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                      </a>
                </span>
              </div>
            ))}
            <div className="select-click" onClick={handleOpen} />
          </div>
        </div>

         {isOpen ?
          <div className='select-list'>
            <Form.Control onFocus={true} value={search} onChange={(e)=> setSearch(e.target.value) } />
            {filteredData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(filteredData[index])}
                  className='select-item'
                >
                  <span className='select-title'>{
                  convertText(item)
                  }</span>
                </div>
              
            ))}
          </div>
          : ''
        }
      </>
    )
}

 export {MultiSelect}