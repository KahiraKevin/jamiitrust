import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Secure Payments for <br />
                            <span className="text-brand-600">Kenya's Digital Economy</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            Stop worrying about being conned. Jamii Trust holds funds securely via M-PESA until the work is delivered and approved. 
                            Fair for Buyers. Safe for Sellers.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register" className="rounded-md bg-brand-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all flex items-center">
                                Get Started <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-brand-600">
                                Log in <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS (Visual Trust Guide) */}
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-brand-600 uppercase tracking-wide">The Process</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            How Jamii Trust Protects You
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 ring-8 ring-white">
                                    <Lock className="h-8 w-8 text-brand-600" aria-hidden="true" />
                                </div>
                                <dt className="text-xl font-bold leading-7 text-gray-900">1. Buyer Secures Funds</dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">The buyer deposits the agreed amount via M-PESA. Jamii Trust locks these funds in a neutral escrow account.</p>
                                </dd>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                                    <ShieldCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
                                </div>
                                <dt className="text-xl font-bold leading-7 text-gray-900">2. Seller Delivers Work</dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">The seller completes the job knowing the money is already there. No more "send work first, pay later" risks.</p>
                                </dd>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                                    <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
                                </div>
                                <dt className="text-xl font-bold leading-7 text-gray-900">3. Payment Released</dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">Once the buyer approves the work, the funds are instantly released to the seller's wallet.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* VALUE PROPOSITION (Why Us?) */}
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-brand-600">Why Choose Jamii Trust?</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Built for the Kenyan Hustle
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                                        <Smartphone className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    M-PESA Integration
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Forget complex international bank transfers. Deposit and withdraw directly to your mobile phone number.
                                </dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                                        <Lock className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Auto-Release Protection
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Sellers are protected. If a buyer disappears after you submit work, our system automatically releases funds in 3 days.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}