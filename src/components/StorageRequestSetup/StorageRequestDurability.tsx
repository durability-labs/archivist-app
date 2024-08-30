import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WebStorage } from "../../utils/web-storage";
import { StorageDurabilityStepValue } from "./types";
import { InputGroup } from "@codex-storage/marketplace-ui-components";

type Props = {
  onToggleNext: (next: boolean) => void;
};

type Cache = { tolerance: number; nodes: number; proofProbability: number };

export function StorageRequestDurability({ onToggleNext }: Props) {
  const [tolerance, setTolerance] = useState("");
  const [proofProbability, setProofProbability] = useState("");
  const [nodes, setNodes] = useState("");
  const cache = useRef<Cache | null>(null);

  useEffect(() => {
    if (cache.current) {
      return;
    }

    WebStorage.get<StorageDurabilityStepValue>("storage-request-step-3").then(
      (val) => {
        if (val) {
          cache.current = val;
          setTolerance(val.tolerance.toString());
          setProofProbability(val.proofProbability.toString());
          setNodes(val.nodes.toString());
          onToggleNext(shouldEnableNext());
        }
      }
    );

    return () => {
      WebStorage.set("storage-request-step-3", cache.current);
    };
  }, [onToggleNext]);

  const shouldEnableNext = () => {
    return (
      cache.current?.tolerance != undefined &&
      !!cache.current.proofProbability != undefined &&
      !!cache.current.nodes
    );
  };

  const updateCache = (data: Partial<Cache>) => {
    if (!cache.current) {
      cache.current = { nodes: 0, proofProbability: 0, tolerance: 0 };
    }

    cache.current = { ...cache.current, ...data };
  };

  const onChangeTolerance = (e: ChangeEvent<HTMLInputElement>) => {
    setTolerance(e.currentTarget.value);
    updateCache({ tolerance: parseInt(e.currentTarget.value || "0", 10) });
    onToggleNext(shouldEnableNext());
  };

  const onChangeProofProbability = (e: ChangeEvent<HTMLInputElement>) => {
    setProofProbability(e.currentTarget.value);
    updateCache({
      proofProbability: parseInt(e.currentTarget.value || "0", 10),
    });
    onToggleNext(shouldEnableNext());
  };

  const onChangeNodes = (e: ChangeEvent<HTMLInputElement>) => {
    setNodes(e.currentTarget.value);
    updateCache({ nodes: parseInt(e.currentTarget.value || "0", 10) });
    onToggleNext(shouldEnableNext());
  };

  return (
    <div>
      <span className="storageRequest-title">
        Define your criteria to make your data durable
      </span>
      <div className="input-spacing">
        <InputGroup
          label="Nodes"
          id="nodes"
          value={nodes}
          onChange={onChangeNodes}
          group={"nodes"}
        />
        <div>
          <span className="input-helper-text text-secondary input-full">
            Minimal number of nodes the content should be stored on
          </span>
        </div>
      </div>

      <div className="input-spacing">
        <InputGroup
          label="Tolerance"
          id="tolerance"
          value={tolerance}
          onChange={onChangeTolerance}
          group={"nodes"}
        />
        <div>
          <span className="input-helper-text text-secondary">
            Additional number of nodes on top of the nodes property that can be
            lost before pronouncing the content lost
          </span>
        </div>
      </div>

      <div className="input-spacing">
        <InputGroup
          label="Proof probability"
          id="proofProbability"
          value={proofProbability}
          onChange={onChangeProofProbability}
          group={"seconds"}
        />
        <div>
          <span className="input-helper-text text-secondary">
            How often storage proofs are required as decimal string
          </span>
        </div>
      </div>
    </div>
  );
}
