import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { connekt, connektvatar } from "@/lib/consts";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { parseEther } from "viem";

function Balance({ address }: { address: `0x${string}` }) {
  const { data: balance, isLoading } = useReadContract({
    address: connekt.contractAddress,
    abi: connekt.contractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <p className="text-xl font-bold text-yellow-500">
      {parseInt(balance as string)} CNKT
    </p>
  );
}

function MyConnectVatar({ address }: { address: `0x${string}` }) {
  const account = useAccount();
  const [connectedTag, setConnectedTag] = useState<string>("");
  const [listeningSelfTag, setListeningSelfTag] = useState<boolean>(false);
  const {
    data: hash,
    writeContract,
    isSuccess: isMintSuccess,
    isPending: isMintPending,
    error: mintError,
  } = useWriteContract();

  useEffect(() => {
    // Check if connectedTag is in localStorage or else add it to localStorage
    const tag = localStorage.getItem("connectedTag");
    if (tag) {
      setConnectedTag(tag);
    }
  }, []);

  function handleTagRead() {
    setListeningSelfTag(true);
    const ndef = new NDEFReader();
    ndef
      .scan()
      .then(() => {
        console.log("Scan started successfully.");
        ndef.onreadingerror = (event) => {
          console.log(
            "Error! Cannot read data from the NFC tag. Try a different one?"
          );
        };
        ndef.onreading = ({ message, serialNumber }) => {
          window.alert(
            "Scan started successfully." +
              JSON.stringify({ message, serialNumber })
          );
          setConnectedTag(serialNumber);
          console.log("NDEF message read.");
          setListeningSelfTag(false);
        };
      })
      .catch((error) => {
        console.log(`Error! Scan failed to start: ${error}.`);
      });
  }

  const {
    data: tokenId,
    isLoading: isTokenLoading,
    error: tokenIdError,
  } = useReadContract({
    abi: connektvatar.contractAbi,
    address: connektvatar.contractAddress,
    functionName: "getTokenIdForAddress",
    args: [address],
  });

  useEffect(() => {
    tokenIdError && console.error("Error ", tokenIdError);
    console.log("tokenId", tokenId);
  }, []);

  return isTokenLoading ? (
    <p>Loading your Connectvatar...</p>
  ) : tokenId === undefined ? (
    <section>
      <div>
        <h1 className="text-2xl font-bold ">Let&apos;s get started</h1>
        <h3 className="text-xl text-zinc-400 font-medium ">
          Sync your Tag & mint your Connektvatar
        </h3>
        <div className="flex flex-col space-y-4 pt-3">
          {connectedTag ? (
            <div className="flex justify-between items-center bg-gray-100 rounded-lg shadow-md p-2">
              <p className="text-gray-800 font-medium">{connectedTag}</p>
              <Button
                onClick={handleTagRead}
                className="text-sm bg-red-500 text-white hover:bg-zinc-800"
              >
                Rescan 🔃
              </Button>
            </div>
          ) : (
            <Button className="font-bold" onClick={handleTagRead}>
              {listeningSelfTag ? "Listening for tag..." : "Sync NFC Tag 🔗"}
            </Button>
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-col space-y-4">
          <p className="mt-2 text-zinc-600 font-medium">
            Create a unique digital representation of yourself.
          </p>
          <Button
            onClick={() => {
              const args = [
                BigInt(
                  JSON.parse(localStorage.getItem("worldcoinSignature") || "{}")
                    .message
                ), // nullifierHash
                BigInt(
                  1
                  // JSON.parse(localStorage.getItem("worldcoinSignature") || "{}")
                  //   .signature
                ), // signedHash
                parseInt(connectedTag), // nfcSerialHash
              ];
              writeContract({
                address: connektvatar.contractAddress,
                abi: connektvatar.contractAbi,
                functionName: "safeMint",
                value: parseEther("0.01"),
                args,
              });
              console.log("Minting...", mintError, args);
            }}
            disabled={isMintPending}
            className="font-bold py-2 px-4 hover:bg-red-500 bg-yellow-400 rounded-md shadow-md"
          >
            {isMintPending
              ? "Minting..."
              : isMintSuccess
              ? "Yay you successfully minted 🎊"
              : "Mint your Connectvatar 🎨"}
            {}
          </Button>
          <p className="text-gray-500 text-sm">
            This will require a small gas fee (one-time cost).
          </p>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold mt-10">Your connekt balance:</h1>
        <div className="flex justify-between items-center py-4 border-b border-1 border-gray-600">
          <p className="text-gray-300 font-medium">Connekt Coin (CNKT)</p>
          {account?.address && <Balance address={account.address} />}
        </div>
      </div>
    </section>
  ) : (
    <div>
      <ConnectWithFrens />
    </div>
  );
}

function ConnectWithFrens() {
  function handleFrenTagRead() {
    const ndef = new NDEFReader();
    ndef
      .scan()
      .then(() => {
        console.log("Scan started successfully.");
        ndef.onreadingerror = (event) => {
          console.log(
            "Error! Cannot read data from the NFC tag. Try a different one?"
          );
        };
        ndef.onreading = ({ message, serialNumber }) => {
          window.alert(
            "Scan started successfully." +
              JSON.stringify({ message, serialNumber })
          );
          // Add the function to connect with frens
          // TODO: Check with contract if already connected
          // If not, connect with frens
          // TODO: Share the NFC tag of fren to the contract to validate and earn points
        };
      })
      .catch((error) => {
        console.log(`Error! Scan failed to start: ${error}.`);
      });
  }
  return (
    <section>
      <h1 className="text-2xl font-bold mt-10">
        Now, Connect with frens to earn CNKT coins
      </h1>
      <div className="flex justify-between items-center py-4 ">
        {/* UI to read NFC from others  */}
        <p className="text-gray-300 font-medium">Make some monies 🤑</p>
        <Button
          onClick={
            //  TODO: Add the function to read NFC from others
            handleFrenTagRead
          }
          className="font-bold py-2 px-4  rounded-md shadow-md text-white hover:text-white hover:bg-red-500 bg-blue-500 border-red-500  border-3 
        "
        >
          Connect with frens 🤝
        </Button>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const account = useAccount();

  return (
    <div className="container mx-auto px-4 py-2">
      <MyConnectVatar address={account?.address as any} />

      <section className="ring-1 rounded-xl ring-zinc-600 p-3 mt-10">
        <h1 className="text-xl font-bold text-white mb-2  ">
          Previous Winners
        </h1>
        <div className="flex justify-start items-center">
          <img
            className="h-20 w-20"
            src="https://media.discordapp.net/attachments/1235922622362161242/1236320537031213096/monumental-purring-toucanet-from-arcadia.jpg?ex=663794b9&is=66364339&hm=57a58bc5dd54ecfdc6f7f24d91684dc2dec102632625c99e648a985d99df6a6f&=&format=webp&width=993&height=993"
            alt=""
          />
          <div className="text-lg ml-2">ccarella.eth</div>
        </div>
      </section>
    </div>
  );
}
