import { useLazyQuery } from "@apollo/client";
import {
    Grid,
    Container,
    TextField,
    Card,
    Divider,
    CardHeader,
    CardContent,
    IconButton,
    CircularProgress,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    LinearProgress
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { endOfMonth, startOfMonth } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Device, Session } from "./types";
import { DEVICE_BILLERS, PARKING_SESSIONS } from "./api";
import { Collection } from "src/api/types";
import { Check, SearchOutlined } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LineChart } from "@mui/x-charts";
import ReactApexChart from "react-apexcharts";
import { AuthtContext } from "src/api/account";


const DeviceRecipes: React.FC = () => {
    const [code, setCode] = useState(''); // Code of device
    const [date, setDate] = useState(startOfMonth(Date.now()));
    const [sessionsQuery, { data, loading, error }] = useLazyQuery<{ parkingSessions: Collection<Session>}, { before: string, after: string/*, parking?: string */, device?: string }>(PARKING_SESSIONS);
    const [chart, setChart] = useState<{ xAxis: any, totals: any[], receiveds: any[], missings: any[], invoiceMissings: any[]}>();
    
    const { person: { site }} = useContext(AuthtContext);
    const [devicesQuery, { data: devices, loading: devicesLoading, error: devicesError }] = useLazyQuery<{ deviceBillers: Collection<Device>}, { code: string, sites?: string[] }>(DEVICE_BILLERS);
    const [device, setDevice] = useState<Device|undefined>();

    const getSessions = () => {
        if(device){
            sessionsQuery({
                variables: {
                    after: date.toISOString(),
                    before: endOfMonth(date).toISOString(),
                    device: device.code
                }
            });
        }
    };

    const goToThisMonth = () => {
        setDate(startOfMonth(Date.now()));
    }
    useEffect(() => {
        // TODO: Conversion des dates de fin de sessions en date locale pour une cohérence des informations
        if(data) {
            const totals = data.parkingSessions.edges.map(({ node }) => node.total);
            const receiveds = data.parkingSessions.edges.map(({ node }) => {
                const amount = node.total - node.missing - node.invoiceMissing;
                if(amount < 0) 
                    return 0;
                
                    return amount;
            });
            const missings = data.parkingSessions.edges.map(({ node }) => node.missing);
            const invoiceMissings = data.parkingSessions.edges.map(({ node }) => node.invoiceMissing);
            const xAxis = data.parkingSessions.edges.map(({ node }) => {
                const date = new Date(node.endAt);
                return date.getDate();
            });

            setChart({ totals, missings, invoiceMissings, xAxis, receiveds });
        }
    }, [data, error]);

    useEffect(() => {
        if(device) {
            getSessions();
        }
    }, [device, date]);


    useEffect(() => {
        if(code.length >= 4) {
            devicesQuery({ variables: { code, sites: site.sectionsArray.map(value => value.id + '') }});
        }
    }, [code]);

    return (
      <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12} md={4}>
            <br />
            <Card>
                <CardContent>
                    <TextField
                        value={code}
                        onChange={({ target: { value }}) => {
                            setCode(value);
                        }}
                        id="serie_number"
                        label="Numéro serie"
                        placeholder="e.g LUB150"
                        autoFocus
                    />
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardContent>
                    <List>
                        {
                            devices?.deviceBillers.edges.slice(0,10).map(({ node }, index) => (
                                <ListItem key={index.toString()} onClick={() => setDevice(node)}>
                                    <ListItemText primary={node.code} secondary={'Site: ' + node.site.name + (node.state ?  ' - Statut: ' + node.state : '')} />
                                    {device?.id === node?.id && (
                                        <ListItemAvatar>
                                            <Check color="primary" />
                                        </ListItemAvatar>
                                    )}
                                </ListItem>
                            ))
                        }
                        {!devices && (
                            <ListItem>
                                <ListItemText primary='Recherchez une machine' />
                            </ListItem>
                        )}
                        {   devices?.deviceBillers.totalCount === 0 && (
                            <ListItem>
                                <ListItemText primary='Aucun résultat trouvé !' />
                            </ListItem>
                        )}
                    </List>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={8}>
            <br />
            <Card>
                <CardContent sx={{ alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            views={['month', 'year']}
                            label="Date"
                            openTo="month"
                            value={date}
                            onChange={(value) => {
                                setDate(value);
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </LocalizationProvider>

                    <Button onClick={goToThisMonth}>Ce mois</Button>
                    
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardHeader title="Recette de la machine" />
                { (loading || devicesLoading) ? <LinearProgress sx={{ marginX: 10 }} /> : <Divider /> }
                <CardContent>
                    { chart && (
                        <LineChart
                            xAxis={[{ data: chart.xAxis, scaleType: 'point' }]}
                            series={[
                                { data: chart.totals, label: 'Montant machine', color: 'cyan' },
                                { data: chart.receiveds, label: 'Montant reçu' },
                                { data: chart.missings, label: 'Manquant', color: 'red' },
                                { data: chart.invoiceMissings, label: 'Ratés', color: 'orange' },
                            ]}
                            height={300}
                        />
                    )}
                    {!chart && <Typography>Aucun contenu récupéré !</Typography>}
                </CardContent>
            </Card>
            <br />
            <Card >
                <CardHeader title={"Rapport global  - Total machine: " + (chart ? chart.totals.reduce((previous, next) => previous + next , 0) : 0) + " CDF"} />
                { (loading || devicesLoading) ? <LinearProgress sx={{ marginX: 10 }} /> : <Divider /> }
                <CardContent>                    
                    {chart && (
                        <ReactApexChart
                            options={{ labels: ['Montant reçu','Manquant','Factures ratés'] }}
                            series={[
                                chart.receiveds.reduce((previous, current) => previous + current, 0),
                                chart.missings.reduce((previous, current) => previous + current, 0),
                                chart.invoiceMissings.reduce((previous, current) => previous + current, 0),
                            ]}
                            type='donut' />
                    )}
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Container>
    );
}

export default DeviceRecipes;