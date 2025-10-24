import React, { useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'
import styles from './progress.module.scss'
import Image from 'next/image'
import { DateTime } from 'luxon'


interface ActivityLog {
  id: string
  action: string
  updated_at: string
}


interface SingleLcData {
  amount: number 
  status: string
  activityLogs: ActivityLog[]
}


interface ProgressProps {
  singleLcData: SingleLcData | undefined
}

const Progress: React.FC<ProgressProps> = ({ singleLcData }) => {
  const [progress, setProgress] = useState<number>(0)
  const totalSteps = 6

  useEffect(() => {
    const calculateProgress = () => {
      const stepCount = singleLcData?.activityLogs?.length || 0
      const eachStepPercentage = (stepCount / totalSteps) * 100
      setProgress(Math.round(eachStepPercentage))
    }

    calculateProgress()
  }, [singleLcData])

  const formatDate = (dateString: string | undefined) => {
    const dt = DateTime.fromISO(dateString || '')
    return dt.isValid ? dt.toFormat('ff') : ''
  }

  return (
    <div className={styles.progress}>
      <h5>LC Progress</h5>

      <div className={styles.progress__box}>
        <div>
          <h4>LC Progress</h4>
          <p>{progress}%</p>
        </div>

        <div className={styles.progress_bar}>
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.progress__main}>
        {[
          'LC Created',
          'Escrow Funded',
          'Seller Invited',
          'Document Uploaded',
          'Goods Delivered',
          'Payment Released',
        ].map((label, index) => (
          <div key={index}>
            <div>
              <h4>
                Step {index + 1}/{totalSteps}
              </h4>
              {singleLcData?.activityLogs?.[index] && (
                <span style={{ marginLeft: 5 }}>
                  <Image src="/check.svg" width={14} height={14} alt="check" />
                </span>
              )}
            </div>
            <p>{label}</p>
            <h6>{formatDate(singleLcData?.activityLogs?.[index]?.updated_at)}</h6>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Progress
