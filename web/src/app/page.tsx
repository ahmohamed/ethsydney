"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import Dashboard from "@/components/Pages/Dashboard";

export default function Home() {
  const [worldcoinId, setWorldcoinId] = useState<any>(null);
  const account = useAccount();

  useEffect(() => {}, []);

  const handleVerify = (proof: any) => {
    // console.log(proof);
  };

  const onSuccess = (proof: any) => {
    // console.log(proof);
    setWorldcoinId(proof);
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center p-10">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="relative flex place-items-center">
        <Image
          className="relative mr-10"
          src="/giphy.gif"
          alt="Logo"
          width={300}
          height={300}
          priority
        />
        <div className="mr-10">
          <div className="text-3xl font-bold">connectamint</div>
          <div className="text-lg">connect to win</div>
        </div>
      </div>

      <section className="lg:max-w-5xl lg:w-full ">
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
          {!account?.address ? (
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-md mb-5">
                Connect your wallet to get started
              </h3>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex justify-center items-start flex-col">
              <div className="flex w-full justify-between items-center">
                <ConnectButton />

                {!worldcoinId ? (
                  <IDKitWidget
                    app_id="app_staging_d1949ce471d8eae4777df0a864bcc8f8" // obtained from the Developer Portal
                    action="verify_human" // this is your action id from the Developer Portal
                    action_description="verify your identity" // this is your action description from the Developer Portal
                    onSuccess={onSuccess} // callback when the modal is closed
                    handleVerify={handleVerify} // optional callback when the proof is received
                    verification_level={VerificationLevel.Device}
                  >
                    {({ open }) => (
                      <Button className="font-bold" onClick={open}>
                        Verify with World ID
                      </Button>
                    )}
                  </IDKitWidget>
                ) : (
                  <div className="">
                    <Badge>Verified with Worldcoin</Badge>
                    <p className="text-zinc-600 mt-2">
                      {worldcoinId.nullifier_hash.slice(0, 10)}...
                      {worldcoinId.nullifier_hash.slice(-10)}
                    </p>
                  </div>
                )}
              </div>

              {account?.address && (
                <section className="mt-4">
                  <Dashboard />
                </section>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
