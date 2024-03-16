import { useEffect, useState } from 'react'
import { Config } from '../config'

const Panigation = (props) => {
    // const { dictionary } = useLanguage()
    const [pager,setPager]= useState({})
    const {items,onChangePage, pageSize} = props
    // console.log('data',items)
    // console.log('pager',pager)
    useEffect(() => {
        if(items && items.length ) {
            setPage(Config.initialPage)
        }
        else
        {
            onChangePage([])
        }
    },[items,pageSize])

    const setPage = (page) => {
        // let _pageSize = pageSize

        let _pager = pager

        if (page < 1 || page > _pager.totalPages) {

            return
        }

        // get new pager object for specified page
        _pager = getPager(items.length, page, pageSize)

        // get new page of items from items array
        let pageOfItems = items.slice(_pager.startIndex, _pager.endIndex + 1)

        // update state
        setPager(_pager)

        // call change page function in parent component
        onChangePage(pageOfItems)
    }

    const getPager = (totalItems, currentPage, pageSize) => {
        // default to first page
        currentPage = currentPage || 1

        // default page size is 10
        pageSize = pageSize || 10

        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize)

        let startPage, endPage
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1
            endPage = totalPages
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1
                endPage = 10
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9
                endPage = totalPages
            } else {
                startPage = currentPage - 5
                endPage = currentPage + 4
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

        // create an array of pages to ng-repeat in the pager control
        let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i)

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        }
    }
    if(!items || !items.length ) {
        return null
    }

    return (

        <PanigationView pager={pager} setPage={setPage} />
    )
}

const PanigationView = (props) => {
    const {setPage,pager} = props
    if ( pager.pages?.length <= 1) {
        // don't display pager if there is only 1 page
        return null;
    }
    //console.log(pager)
    return (
        <>
        <div className="px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between card-footer">
            <div className="nav">
                <ul className="mb-0 pagination">
                    <li className={`page-item  + ${pager.currentPage === 1 ? 'disabled' : ''}`}  >
                        <a
                            className="page-link"
                            role="button"
                            tabIndex="0"
                            onClick={()=>setPage(pager.currentPage - 1)}
                        >
                            <span aria-hidden="true">Trang trước</span>
                            <span className="visually-hidden">Previous</span>
                        </a>
                    </li>
                    {pager.pages?.map((page, index) =>
                                <li
                                    key={index}
                                    style={{margin:0}}
                                    className={ `page-item  + ${pager.currentPage === page ? 'active' : ''}`}
                                >
                                    {
                                        pager.currentPage === page?
                                        <span className="page-link">{page}<span className="visually-hidden">(current)</span>
                                        </span>
                                        :
                                        <a
                                            className="page-link "
                                            role="button"
                                            tabIndex="0"
                                            onClick={()=>setPage(page)}
                                        >
                                            {page}
                                        </a>
                                    }
                                </li>
                    )}
                    <li  className={`page-item + ${pager.currentPage === pager.totalPages ? 'disabled' : ''}` }>
                                <a
                                    className="page-link"
                                    role="button"
                                    tabIndex="0"
                                    onClick={()=>setPage(pager.currentPage + 1)}
                                >
                                    <span aria-hidden="true">Trang sau</span>
                                    <span className="visually-hidden">Next</span>
                                </a>
                    </li>
                </ul>
            </div>
            <small className="fw-normal small mt-4 mt-lg-0">Hiển thị từ {pager.startIndex+1} đến {pager.endIndex+1} trên tổng {pager.totalItems} </small>
           </div>
        </>
    )
}
export {Panigation}
