'use client';

import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LogoCloud({ className, ...props }) {
    return (
        <div
            className={cn(
                'relative grid grid-cols-2 border-x md:grid-cols-4',
                className
            )}
            {...props}
        >
            <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

            {/* Row 1 */}
            <LogoCard
                className="relative border-r border-b bg-secondary/30"
                logo={{
                    src: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
                    alt: 'Government of India',
                }}
            >
                <PlusIcon
                    className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
                    strokeWidth={1}
                />
            </LogoCard>

            <LogoCard
                className="border-b md:border-r"
                logo={{
                    src: 'https://janaushadhi.gov.in/images/logo.png',
                    alt: 'Jan Aushadhi - 10,000+ Generic Medicines',
                }}
            />

            <LogoCard
                className="relative border-r border-b md:bg-secondary/30"
                logo={{
                    src: 'https://www.nppaindia.nic.in/images/nppa-logo.png',
                    alt: 'NPPA - Price Regulation',
                }}
            >
                <PlusIcon
                    className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
                    strokeWidth={1}
                />
                <PlusIcon
                    className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 md:block"
                    strokeWidth={1}
                />
            </LogoCard>

            <LogoCard
                className="relative border-b bg-secondary/30 md:bg-background"
                logo={{
                    src: 'https://upload.wikimedia.org/wikipedia/commons/2/26/World_Health_Organization_Logo.svg',
                    alt: 'WHO - Essential Medicines List',
                }}
            />

            {/* Row 2 */}
            <LogoCard
                className="relative border-r border-b bg-secondary/30 md:border-b-0 md:bg-background"
                logo={{
                    src: 'https://cdsco.gov.in/opencms/export/sites/CDSCO_WEB/images/logo.png',
                    alt: 'CDSCO - Drug Safety',
                }}
            >
                <PlusIcon
                    className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 md:hidden"
                    strokeWidth={1}
                />
            </LogoCard>

            <LogoCard
                className="border-b bg-background md:border-r md:border-b-0 md:bg-secondary/30"
                logo={{
                    src: 'https://www.esic.gov.in/sites/default/files/logo/logo.png',
                    alt: 'ESIC - Employee Health',
                }}
            />

            <LogoCard
                className="border-r"
                logo={{
                    src: 'https://www.mohfw.gov.in/sites/all/themes/mohfw/images/mohfw_logo.png',
                    alt: 'Ministry of Health',
                }}
            />

            <LogoCard
                className="bg-secondary/30"
                logo={{
                    src: 'https://www.nhp.gov.in/sites/all/themes/NHP/images/NHP_Logo.png',
                    alt: 'National Health Portal',
                }}
            />

            <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
        </div>
    );
}

function LogoCard({ logo, className, children, ...props }) {
    return (
        <div
            className={cn(
                'flex items-center justify-center bg-background px-4 py-8 md:p-8',
                className
            )}
            {...props}
        >
            <img
                alt={logo.alt}
                className="pointer-events-none h-8 select-none md:h-10 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                height={logo.height || 'auto'}
                src={logo.src}
                width={logo.width || 'auto'}
            />
            {children}
        </div>
    );
}
