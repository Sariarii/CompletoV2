interface ServiceRow {
  service: string;
  grossEUR: number;
  marginEUR: number;
  totalEUR: number;
}

interface Props {
  data: ServiceRow[];
  totalGross: number;
  totalMargin: number;
  totalRefacture: number;
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n);
}

export default function ServicesTable({ data, totalGross, totalMargin, totalRefacture }: Props) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Service AWS</th>
            <th>Catégorie</th>
            <th className="num">Coût brut HT</th>
            <th className="num">Marge 18 %</th>
            <th className="num">Refacturé HT</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.service}>
              <td><span className="pill pill-aws">{d.service}</span></td>
              <td>{categoryOf(d.service)}</td>
              <td className="num">{formatEUR(d.grossEUR)}</td>
              <td className="num">{formatEUR(d.marginEUR)}</td>
              <td className="num">{formatEUR(d.totalEUR)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={2}><b>TOTAL</b></td>
            <td className="num"><b>{formatEUR(totalGross)}</b></td>
            <td className="num"><b>{formatEUR(totalMargin)}</b></td>
            <td className="num"><b>{formatEUR(totalRefacture)}</b></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function categoryOf(service: string): string {
  const s = service.toLowerCase();
  if (s.includes('lambda')) return 'Compute';
  if (s.includes('dynamodb')) return 'Database';
  if (s.includes('s3')) return 'Stockage';
  if (s.includes('cloudfront')) return 'Réseau / CDN';
  if (s.includes('cognito')) return 'Sécurité';
  if (s.includes('cloudwatch')) return 'Observabilité';
  if (s.includes('blockchain')) return 'Blockchain';
  if (s.includes('rekognition')) return 'IA / ML';
  return 'Autre';
}
