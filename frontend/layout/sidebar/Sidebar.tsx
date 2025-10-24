'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import styles from './sidebar.module.scss'
import { usePathname } from 'next/navigation'
import useAuthStore from '@/store/AuthStore'


const menu = [
    {
        name: 'Dashboard',
        link: '/dashboard',
        icon: '/dashboard.svg',
        activeIcon: '/bdashboard.svg'
    },

    {
        name: 'LC Management',
        link: '/dashboard/lc-management',
        icon: '/bill-line.svg',
        activeIcon: '/bill-line.svg'
    },

    // {
    //     name: 'Transactions',
    //     link: '/dashboard/ts',
    //     icon: '/bill-line.svg',
    //     activeIcon: '/bill-line.svg'
    // },

    {
        name: 'Create LC',
        link: '/dashboard/create',
        icon: '/nlc.svg',
        activeIcon: '/lc.svg'
    },
]

const Sidebar = () => {
    const [active, setActive] = useState('')
    const pathname = usePathname();
    const {user} = useAuthStore()

    console.log(pathname)

  return (
    <div className={styles.sidebar}>
        <div className={styles.sidebar__header}>
            <Image width={154} height={30} src="/blocq.svg" alt='' />

            <Image width={24} height={24} src="/menu-blocq.svg" alt='' />
        </div>
        <div className={styles.sidebar__menu}>
            <h4>Main</h4>

            {menu.map((data, index)=> {
                return(
                    <Link key={index} href={data?.link}>
                        <div  className={pathname === data?.link ? styles.active : styles.link}>
                            <Image width={20} height={20} src={pathname === data?.link ? data?.activeIcon : data?.icon} alt='' />
                            <p>{data?.name}</p>
                        </div>
                       {/* <ReactSVG  /> */}
                    </Link>
                )
            })}
        </div>
        <div style={{marginTop: '20px'}} className={styles.sidebar__menu}>
            <h4>others</h4>

            <Link href=''>
                {/* <ReactSVG src='/bill-line.svg' /> */}
                <div className={pathname === '/dashboard/settings' ? styles.active : styles.link}>
                    <Image width={20} height={20} src='/bill-line.svg'alt='' />
                    <p>Settings</p>
                </div>
            </Link>

            {/* <Link href=''>
                <div className={pathname === '/dashboard/support' ? styles.active : styles.link}>
                    <Image width={20} height={20} src='/bill-line.svg'alt='' />
                    <p>Support</p>
                </div>
            </Link> */}
        </div>
        <div className={styles.footercover}>
            <div className={styles.footer}>
                <Image width={40} height={40} src='/avee.svg'alt='' />
                <div>
                    <h4>{user?.firstName} {user?.lastName}<Image width={12.55} height={12.55} src='/ve.svg'alt='' /></h4>
                    <p>{user?.email}</p>
                </div>
                <Image width={5} height={9} src='/arrow-r.svg'alt='' />
            </div>
        </div>
    </div>
  )
}

export default Sidebar