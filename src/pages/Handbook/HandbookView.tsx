import { memo, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getHandbookDoc } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";
import { HandbookLayout } from "../../components/handbook/HandbookLayout";
import QueueVsPubsubMdx from "./mdx/QueueVsPubsub.mdx";
import SoaOverviewMdx from "./mdx/SoaOverview.mdx";
import DvaOverviewMdx from "./mdx/DvaOverview.mdx";
import AwsCommonOverviewMdx from "./mdx/AwsCommonOverview.mdx";
import AcidTransactionLockMdx from "./mdx/AcidTransactionLock.mdx";
import AuthnVsAuthzMdx from "./mdx/AuthnVsAuthz.mdx";
import IpCidrSubnettingMdx from "./mdx/IpCidrSubnetting.mdx";
import RoutingTableMdx from "./mdx/RoutingTable.mdx";
import NatMdx from "./mdx/Nat.mdx";
import DnsResolverVsAuthoritativeMdx from "./mdx/DnsResolverVsAuthoritative.mdx";
import TcpVsUdpMdx from "./mdx/TcpVsUdp.mdx";
import HttpHttpsTlsMdx from "./mdx/HttpHttpsTls.mdx";
import L4VsL7LbMdx from "./mdx/L4VsL7Lb.mdx";
import BlockFileObjectMdx from "./mdx/BlockFileObject.mdx";
import LatencyThroughputIopsMdx from "./mdx/LatencyThroughputIops.mdx";
import IndexWhyFastMdx from "./mdx/IndexWhyFast.mdx";
import CachingMdx from "./mdx/Caching.mdx";
import ScaleUpScaleOutMdx from "./mdx/ScaleUpScaleOut.mdx";
import StatelessStatefulMdx from "./mdx/StatelessStateful.mdx";
import IdempotencyMdx from "./mdx/Idempotency.mdx";
import CapTheoremMdx from "./mdx/CapTheorem.mdx";
import ConsistencyModelMdx from "./mdx/ConsistencyModel.mdx";
import DistributedTransactionLockMdx from "./mdx/DistributedTransactionLock.mdx";
import EventDrivenArchMdx from "./mdx/EventDrivenArch.mdx";
import HashVsEncryptionMdx from "./mdx/HashVsEncryption.mdx";
import LeastPrivilegeMdx from "./mdx/LeastPrivilege.mdx";
import FirewallMdx from "./mdx/Firewall.mdx";
import ObservabilityMdx from "./mdx/Observability.mdx";
import RetryBackoffMdx from "./mdx/RetryBackoff.mdx";
import ThrottlingRateLimitingMdx from "./mdx/ThrottlingRateLimiting.mdx";
import RtoRpoMdx from "./mdx/RtoRpo.mdx";
import HaDesignMdx from "./mdx/HaDesign.mdx";
import SliSloMdx from "./mdx/SliSlo.mdx";
import ContainerImageMdx from "./mdx/ContainerImage.mdx";
import ContainerRegistryMdx from "./mdx/ContainerRegistry.mdx";
import ContainerRuntimeMdx from "./mdx/ContainerRuntime.mdx";
import ContainerServiceEndpointMdx from "./mdx/ContainerServiceEndpoint.mdx";

const DOC_URL_PREFIX = "/handbook";
const LAYERS_WITH_DIAGRAM = ["core-cs", "aws-common", "saa", "dva", "soa"];
const SCROLL_BACK_KEY = "handbookScrollBackHash";
const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

function RelatedInSection({
  layerId,
  sectionTitle,
  docs,
  currentSlug,
}: {
  layerId: string;
  sectionTitle: string;
  docs: { slug: string; title: string }[];
  currentSlug: string;
}) {
  const siblings = docs.filter((d) => d.slug !== currentSlug);
  if (siblings.length === 0) return null;

  return (
    <aside className="mt-10 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold text-foreground mb-3">
        이 섹션의 다른 개념 ({sectionTitle})
      </h2>
      <ul className="flex flex-wrap gap-x-1 gap-y-1">
        {siblings.map((d, i) => (
          <li key={d.slug} className="inline">
            <Link
              to={`/handbook/${layerId}/${d.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {d.title}
            </Link>
            {i < siblings.length - 1 && (
              <span className="text-muted-foreground/60 mx-1.5">·</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function useHandbookDoc(layerId: string | undefined, slug: string | undefined) {
  return useMemo(
    () => (layerId && slug ? getHandbookDoc(layerId, slug) : null),
    [layerId, slug]
  );
}

const HandbookView = memo(function HandbookView() {
  const { layerId, slug } = useParams<{ layerId: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const meta = useHandbookDoc(layerId, slug);

  const isMdxDoc = (() => {
    if (!layerId || !slug) return false;
    if (layerId === "core-cs" && slug === "observability") return true;
    if (layerId === "core-cs" && slug === "retry-backoff") return true;
    if (layerId === "core-cs" && slug === "throttling-rate-limiting") return true;
    if (layerId === "core-cs" && slug === "rto-rpo") return true;
    if (layerId === "core-cs" && slug === "ha-design") return true;
    if (layerId === "core-cs" && slug === "sli-slo") return true;
    if (layerId === "core-cs" && slug === "ip-cidr-subnetting") return true;
    if (layerId === "core-cs" && slug === "routing-table") return true;
    if (layerId === "core-cs" && slug === "nat") return true;
    if (layerId === "core-cs" && slug === "dns-resolver-vs-authoritative") return true;
    if (layerId === "core-cs" && slug === "tcp-vs-udp") return true;
    if (layerId === "core-cs" && slug === "http-https-tls") return true;
    if (layerId === "core-cs" && slug === "l4-vs-l7-lb") return true;
    if (layerId === "core-cs" && slug === "block-file-object") return true;
    if (layerId === "core-cs" && slug === "latency-throughput-iops") return true;
    if (layerId === "core-cs" && slug === "index-why-fast") return true;
    if (layerId === "core-cs" && slug === "caching") return true;
    if (layerId === "core-cs" && slug === "scale-up-scale-out") return true;
    if (layerId === "core-cs" && slug === "stateless-stateful") return true;
    if (layerId === "core-cs" && slug === "idempotency") return true;
    if (layerId === "core-cs" && slug === "cap-theorem") return true;
    if (layerId === "core-cs" && slug === "consistency-model") return true;
    if (layerId === "core-cs" && slug === "event-driven-arch") return true;
    if (layerId === "core-cs" && slug === "container-image") return true;
    if (layerId === "core-cs" && slug === "container-registry") return true;
    if (layerId === "core-cs" && slug === "container-runtime") return true;
    if (layerId === "core-cs" && slug === "container-service-endpoint") return true;
    if (layerId === "core-cs" && slug === "container-orchestration") return true;
    if (layerId === "core-cs" && slug === "distributed-transaction-lock") return true;
    if (layerId === "core-cs" && slug === "hash-vs-encryption") return true;
    if (layerId === "core-cs" && slug === "least-privilege") return true;
    if (layerId === "core-cs" && slug === "firewall") return true;
    if (layerId === "core-cs" && slug === "queue-vs-pubsub") return true;
    if (layerId === "core-cs" && slug === "acid-transaction-lock") return true;
    if (layerId === "core-cs" && slug === "authn-vs-authz") return true;
    if (layerId === "soa" && slug === "overview") return true;
    if (layerId === "dva" && slug === "overview") return true;
    if (layerId === "aws-common" && slug === "overview") return true;
    return false;
  })();

  useEffect(() => {
    if (layerId === "core-cs" && slug === "real-system-diagrams") {
      navigate("/handbook/core-cs", { replace: true });
    }
    if (layerId === "core-cs" && slug === "symmetric-asymmetric") {
      navigate("/handbook/core-cs/hash-vs-encryption", { replace: true });
    }
  }, [layerId, slug, navigate]);

  if (layerId === "core-cs" && (slug === "real-system-diagrams" || slug === "symmetric-asymmetric")) {
    return null;
  }

  useEffect(() => {
    if (!layerId || !slug) return;
    if (isMdxDoc) return;
    if (layerId === "core-cs" && slug === "real-system-diagrams") return;
    const resolved = getHandbookDoc(layerId, slug);
    if (!resolved) {
      setContent(null);
      setError(null);
      return;
    }

    setError(null);
    setContent(null);
    const url = `${DOC_URL_PREFIX}/${layerId}/${slug}.md`;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("문서를 불러올 수 없습니다.");
        return res.text();
      })
      .then(setContent)
      .catch((err: unknown) => {
        const isAbort = err instanceof Error && err.name === "AbortError";
        if (!isAbort) {
          setError("문서를 불러오는 중 오류가 발생했습니다.");
        }
      });

    return () => controller.abort();
  }, [layerId, slug]);

  if (!layerId || !slug) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">잘못된 경로입니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="mt-4 text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  if (!meta) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">문서 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="mt-4 text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  if (error) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => navigate(`/handbook/${layerId}`)}
          className="mt-4 text-primary hover:underline"
        >
          {meta.layer.title} 목차로
        </button>
      </main>
    );
  }

  if (!isMdxDoc && content === null) {
    return (
      <main
        className={`${MAIN_CLASS} flex justify-center items-center min-h-[200px]`}
      >
        <LoadingSpinner />
      </main>
    );
  }

  const backScrollHash =
    (location.state as { scrollBackHash?: string } | null)?.scrollBackHash ??
    (typeof window !== "undefined" ? sessionStorage.getItem(SCROLL_BACK_KEY) : null);
  const backToDiagramHref =
    meta.layer.id && LAYERS_WITH_DIAGRAM.includes(meta.layer.id) && getDiagramConfig(meta.layer.id)
      ? `/handbook/${meta.layer.id}${backScrollHash ?? ""}`
      : undefined;

  const mdxComponent = (() => {
    if (!isMdxDoc) return null;
    if (layerId === "core-cs" && slug === "observability") return <ObservabilityMdx />;
    if (layerId === "core-cs" && slug === "retry-backoff") return <RetryBackoffMdx />;
    if (layerId === "core-cs" && slug === "throttling-rate-limiting") {
      return <ThrottlingRateLimitingMdx />;
    }
    if (layerId === "core-cs" && slug === "rto-rpo") return <RtoRpoMdx />;
    if (layerId === "core-cs" && slug === "ha-design") return <HaDesignMdx />;
    if (layerId === "core-cs" && slug === "sli-slo") return <SliSloMdx />;
    if (layerId === "core-cs" && slug === "ip-cidr-subnetting") return <IpCidrSubnettingMdx />;
    if (layerId === "core-cs" && slug === "routing-table") return <RoutingTableMdx />;
    if (layerId === "core-cs" && slug === "nat") return <NatMdx />;
    if (layerId === "core-cs" && slug === "dns-resolver-vs-authoritative") {
      return <DnsResolverVsAuthoritativeMdx />;
    }
    if (layerId === "core-cs" && slug === "tcp-vs-udp") return <TcpVsUdpMdx />;
    if (layerId === "core-cs" && slug === "http-https-tls") return <HttpHttpsTlsMdx />;
    if (layerId === "core-cs" && slug === "l4-vs-l7-lb") return <L4VsL7LbMdx />;
    if (layerId === "core-cs" && slug === "block-file-object") return <BlockFileObjectMdx />;
    if (layerId === "core-cs" && slug === "latency-throughput-iops") {
      return <LatencyThroughputIopsMdx />;
    }
    if (layerId === "core-cs" && slug === "index-why-fast") return <IndexWhyFastMdx />;
    if (layerId === "core-cs" && slug === "caching") return <CachingMdx />;
    if (layerId === "core-cs" && slug === "scale-up-scale-out") return <ScaleUpScaleOutMdx />;
    if (layerId === "core-cs" && slug === "stateless-stateful") return <StatelessStatefulMdx />;
    if (layerId === "core-cs" && slug === "idempotency") return <IdempotencyMdx />;
    if (layerId === "core-cs" && slug === "cap-theorem") return <CapTheoremMdx />;
    if (layerId === "core-cs" && slug === "consistency-model") return <ConsistencyModelMdx />;
    if (layerId === "core-cs" && slug === "event-driven-arch") return <EventDrivenArchMdx />;
    if (layerId === "core-cs" && slug === "container-image") return <ContainerImageMdx />;
    if (layerId === "core-cs" && slug === "container-registry") return <ContainerRegistryMdx />;
    if (layerId === "core-cs" && slug === "container-runtime") return <ContainerRuntimeMdx />;
    if (layerId === "core-cs" && slug === "container-service-endpoint") {
      return <ContainerServiceEndpointMdx />;
    }
    if (layerId === "core-cs" && slug === "container-orchestration") {
      return <ContainerRuntimeMdx />;
    }
    if (layerId === "core-cs" && slug === "distributed-transaction-lock") {
      return <DistributedTransactionLockMdx />;
    }
    if (layerId === "core-cs" && slug === "hash-vs-encryption") return <HashVsEncryptionMdx />;
    if (layerId === "core-cs" && slug === "least-privilege") return <LeastPrivilegeMdx />;
    if (layerId === "core-cs" && slug === "firewall") return <FirewallMdx />;
    if (layerId === "core-cs" && slug === "queue-vs-pubsub") return <QueueVsPubsubMdx />;
    if (layerId === "core-cs" && slug === "acid-transaction-lock") return <AcidTransactionLockMdx />;
    if (layerId === "core-cs" && slug === "authn-vs-authz") return <AuthnVsAuthzMdx />;
    if (layerId === "soa" && slug === "overview") return <SoaOverviewMdx />;
    if (layerId === "dva" && slug === "overview") return <DvaOverviewMdx />;
    if (layerId === "aws-common" && slug === "overview") return <AwsCommonOverviewMdx />;
    return null;
  })();

  return (
    <HandbookLayout
      layerTitle={meta.layer.title}
      sectionTitle={meta.section.title}
      docTitle={meta.doc.title}
      backToDiagramHref={backToDiagramHref}
    >
      {isMdxDoc && mdxComponent}
      {!isMdxDoc && content !== null && (
        <MarkdownViewer
          key={`${layerId}-${slug}`}
          content={content}
          className="max-w-4xl"
        />
      )}
      <RelatedInSection
        layerId={meta.layer.id}
        sectionTitle={meta.section.title}
        docs={meta.section.docs}
        currentSlug={meta.doc.slug}
      />
    </HandbookLayout>
  );
});

export default HandbookView;
