'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MoveRight, Shield, FileText, Search } from 'lucide-react';
import { Button } from '@/app/components/Button';
import Link from 'next/link';

export default function AnimatedHero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ['any medicine', 'any language', 'any Indian', 'every patient', 'safer healthcare'],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2500);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 via-primary-50 to-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex gap-10 py-20 lg:py-32 items-center justify-center flex-col">
                    {/* Badge */}
                    <div>
                        <Button variant="secondary" size="sm" className="gap-3 rounded-full font-mono">
                            <Shield className="w-4 h-4" />
                            AI-Powered Healthcare Platform
                            <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Animated Heading */}
                    <div className="flex gap-6 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tight text-center font-bold leading-tight">
                            <span className="text-gray-900">
                                Works for{' '}
                            </span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent"
                                        initial={{ opacity: 0, y: -100 }}
                                        transition={{ type: 'spring', stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-3xl text-center font-medium">
                            43,000 Indians die from medication errors annually. 80% overpay for medicines.
                            ArogyaAgent uses 7 specialized AI agents to prevent deaths, save money, and
                            provide healthcare access in 10+ Indian languages.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/prescription-scanner">
                            <Button size="lg" className="gap-3 text-lg rounded-xl">
                                <FileText className="w-5 h-5" />
                                Scan Prescription
                                <MoveRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/generic-finder">
                            <Button size="lg" variant="outline" className="gap-3 text-lg rounded-xl">
                                <Search className="w-5 h-5" />
                                Find Generic Medicines
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary-700 font-mono">7</div>
                            <div className="text-sm text-gray-600 mt-1">AI Agents Working</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-success-700 font-mono">85%</div>
                            <div className="text-sm text-gray-600 mt-1">Average Savings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-agent-700 font-mono">10+</div>
                            <div className="text-sm text-gray-600 mt-1">Indian Languages</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
