import { Card, CardHeader, CardContent, LinearProgress, Divider } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { AdaptBy, adaptSessionData } from "src/api/session-adaptator";
import { Session } from "src/content/recipes/types";


const DonutChart: React.FC<{ sessions: Session[], loading: boolean, adaptBy: AdaptBy}> = ({ sessions, loading }) => {
    const sessionsAdapted = adaptSessionData(sessions, 'day');

    const chart = { 
        totals: sessionsAdapted.map(([index, session]) => session.total),
        missings: sessionsAdapted.map(([index, session]) => session.missing), 
        invoiceMissings: sessionsAdapted.map(([index, session]) => session.invoiceMissing), 
        xAxis: sessionsAdapted.map(([index]) => index), 
        receiveds: sessionsAdapted.map(([index, session]) => session.received)
    };
    
    return (
        <>
            {chart && (
                <ReactApexChart
                    options={{ labels: ['Montant reçu CDF','Manquant CDF','Factures ratés CDF'] }}
                    series={[
                        chart.receiveds.reduce((previous, current) => previous + current, 0),
                        chart.missings.reduce((previous, current) => previous + current, 0),
                        chart.invoiceMissings.reduce((previous, current) => previous + current, 0),
                    ]}
                    height={300}
                    type='donut' />
            )}
        </>
    )
};

export default DonutChart;