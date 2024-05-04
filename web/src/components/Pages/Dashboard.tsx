import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { connekt } from "@/lib/consts";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";

// import Nfc from "nfc-react-web";

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
      {JSON.stringify(balance)} CNKT
    </p>
  );
}

export default function Dashboard() {
  const [connectedTag, setConnectedTag] = useState<string>("");
  const account = useAccount();
  const {
    data: hash,
    writeContract: mint,
    isSuccess: isMintSuccess,
    isPending: isMintPending,
  } = useWriteContract();

  async function handleMint() {
    mint({
      address: connekt.contractAddress,
      abi: connekt.contractAbi,
      functionName: "mint",
      args: [
        // Add the tokenId here
        // Other args
      ],
    });
  }

  function handleTagRead() {
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
        };
      })
      .catch((error) => {
        console.log(`Error! Scan failed to start: ${error}.`);
      });
  }

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

  useEffect(() => {
    // Check if connectedTag is in localStorage or else add it to localStorage
    const tag = localStorage.getItem("connectedTag");
    if (tag) {
      setConnectedTag(tag);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h1 className="text-3xl font-bold ">1. Your Tag</h1>
        <div className="flex flex-col space-y-4">
          <p className="text-zinc-600 font-medium">
            Tag your tag everywhere you go.
          </p>
          {connectedTag ? (
            <div className="bg-gray-100 rounded-lg shadow-md p-4">
              <p className="text-gray-800 font-medium">{connectedTag}</p>
            </div>
          ) : (
            <Button className="font-bold" onClick={handleTagRead}>
              Sync NFC Tag 🔗
            </Button>
          )}
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-bold mt-10">2. Mint your Connectvatar</h1>
        <div className="flex flex-col space-y-4">
          <p className="text-zinc-600 font-medium">
            Create a unique digital representation of yourself.
          </p>
          <Button
            onClick={handleMint}
            disabled={isMintPending}
            className="font-bold py-2 px-4 rounded-md shadow-md"
          >
            {isMintPending ? "Minting..." : "Mint your Connectvatar 🎨"}
          </Button>
          <p className="text-gray-500 text-sm">
            This will require a small gas fee (one-time cost).
          </p>
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-bold mt-10">
          3. View your connekt balance
        </h1>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <p className="text-gray-300 font-medium">Connekt Coin (CNKT)</p>
          <span className="text-xl font-bold text-yellow-500">10.00 CNKT</span>
          {account?.address && <Balance address={account.address} />}
        </div>
      </section>
      <section>
        <h1 className="text-3xl font-bold mt-10">
          4. Connect with frens to earn CNKT coins
        </h1>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          {/* UI to read NFC from others  */}
          <p className="text-gray-300 font-medium">Connect with frens</p>
          <Button
            // onClick={
            //  TODO: Add the function to read NFC from others
            // }
            className="font-bold py-2 px-4 rounded-md shadow-md"
          >
            Connect with frens 🤝
          </Button>
        </div>
      </section>
    </div>
  );
}
