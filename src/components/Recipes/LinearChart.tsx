import { LineChart } from "@mui/x-charts";
import { AdaptBy, adaptSessionData } from "src/api/session-adaptator";
import { Session } from "src/content/recipes/types";


const LinearChart: React.FC<{ sessions: Session[], loading: boolean, adaptBy: AdaptBy}> = ({ sessions, loading }) => {
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
            { chart && (
                <LineChart
                    xAxis={[{ data: chart.xAxis, scaleType: 'point' }]}
                    series={[
                        { data: chart.totals, label: 'Montant machine CDF', color: 'cyan' },
                        { data: chart.receiveds, label: 'Montant reçu CDF' },
                        { data: chart.missings, label: 'Manquant CDF', color: 'red' },
                        { data: chart.invoiceMissings, label: 'Ratés CDF', color: 'orange' },
                    ]}
                    height={250}
                />
            )}
        </>
    )
};

export default LinearChart;