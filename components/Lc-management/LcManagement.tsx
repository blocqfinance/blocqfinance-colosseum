import React, { useEffect, useState } from 'react'
import styles from './lc.module.scss'
import { ReactSVG } from 'react-svg'
import Lc from '../lc-box/Lc'
import { getAllLc } from '@/libs/api/collections/lc'
import useSWR from 'swr'

type lcProps = {
    id: string;
    status: string;
    lcId: string;
    created_at: string;
    goodsDescription?: string;
    sellerCompany: string;
    sellerEmail: string;
    currency: string;
    shippingDeadline: string;
    amount: number;
}

const LcManagement = () => {
    const [lcData, setLcData] = useState([]);
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState<number>(0);
    const [status,setStatus] = useState('all');
    // const limit = 9;
    const { data, error } = useSWR(`lc?page=${page}&limit=9`, getAllLc);


    const next = () =>{
        if(page < totalPage){
            setPage(page + 1)
        }
    }

    const previous = () =>{
        if(page > 1){
           setPage(page - 1)
        }
    }

    useEffect(() => {
        console.log(data)
        if(status !== "all"){
            const filteredData = data?.data?.filter((lc: lcProps) => lc.status === status);
            setLcData(filteredData);
        }
        else{
            setLcData(data?.data);
        }
        setTotalPage(data?.pagination?.totalPage)
    }, [data, error, page, status]);

    return (
        <div className={styles.lc}>
            <div className={styles.lc__header}>
                <div className={styles.header}>
                    <h1>LC Management</h1>
                    <p>Manage and track all your Letters of Credit</p>
                </div>
            </div>

            <div className={styles.lc__main}>
                <div>
                    <button onClick={() => setStatus("all")} className={status === "all" ? styles.active : ""}>All LCs</button>
                    <button onClick={() => setStatus("funded")} className={status === "funded" ? styles.active : ""}>Funded</button>
                    <button onClick={() => setStatus("active")} className={status === "active" ? styles.active : ""}>Active</button>
                    <button onClick={() => setStatus("pendingFunding")} className={status === "pendingFunding" ? styles.active : ""}>Pending</button>
                    <button onClick={() => setStatus("completed")} className={status === "completed" ? styles.active : ""}>Completed</button>
                </div>


                {/* <form>
                    <ReactSVG src="/search-blocq.svg" />
                    <input placeholder='Search...' />
                    <ReactSVG src="/Shortcut.svg" />
                </form> */}
            </div>


            <div className={styles.lc__deals}>
                {lcData?.length > 0 ?
                <div>
                    {lcData?.map((lc: lcProps) => (
                        <React.Fragment key={lc.id}>
                            <Lc lcData={lc}/>
                        </React.Fragment>
                    ))}
                </div> : 
                <div className={styles.empty}>
                    <p>You don’t have any {status !== 'all' ? status : ""}{" "}Letters of Credit yet.
                    <br />Create one to get started. </p>
                </div>
                }
            </div>

            {lcData?.length > 0 && <div className={styles.footer}>
                <button onClick={previous} className={styles.pre}>Previous</button>
                <button onClick={next} className={styles.next}>Next</button>
            </div>}
        </div>
    )
}

export default LcManagement