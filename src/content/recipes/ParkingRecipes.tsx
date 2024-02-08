import { useLazyQuery } from "@apollo/client";
import {
    Grid,
    Container,
    TextField,
    Card,
    CardHeader,
    CardContent,
    CircularProgress,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Switch,
    FormControlLabel
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Parking, Session } from "./types";
import { PARKINGS, PARKING_SESSIONS } from "./api";
import { Collection } from "src/api/types";
import { Check, SearchOutlined } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LineChart } from "@mui/x-charts";
import ReactApexChart from "react-apexcharts";


const ParkingRecipes: React.FC = () => {
    const [search, setSearch] = useState(''); // Code of device
    const [date, setDate] = useState(startOfMonth(Date.now()));
    const [sessionsQuery, { data, loading, error }] = useLazyQuery<{ parkingSessions: Collection<Session>}, { before: string, after: string, parking?: string }>(PARKING_SESSIONS);
    const [chart, setChart] = useState<{ xAxis: any, totals: any[], receiveds: any[], missings: any[], invoiceMissings: any[]}>();
    const [parkingsQuery, { data: parkingsData, loading: parkingLoading, error: parkingError }] = useLazyQuery<{ parkings: Collection<Parking>}, { name: string }>(PARKINGS);
    const [parking, setParking] = useState<Parking|undefined>();
    const [trigger, setTrigger] = useState<'item'|'axis'>('axis');

    const getSessions = () => {
        if(parking) {
            sessionsQuery({
                variables: {
                    after: date.toISOString(),
                    before: endOfMonth(date).toISOString(),
                    parking: parking.id
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
        if(search.length >= 2) {
            parkingsQuery({ variables: { name: search }});
        }
    }, [search]);

    useEffect(() => {
        if(parking) {
            getSessions();
        }
    }, [parking, date])

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
                        value={search}
                        onChange={({ target: { value }}) => {
                            setSearch(value);
                        }}
                        fullWidth
                        autoFocus
                        id="serie_number"
                        label="Parking"
                        placeholder="Nom du parking"
                    />
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardContent>
                    <List>
                        {
                            parkingsData?.parkings.edges.slice(0,10).map(({ node }, index) => (
                                <ListItem key={index.toString()} onClick={() => setParking(node)}>
                                    <ListItemText primary={node.name} secondary={node.site.name} />
                                    {parking?.id === node?.id && (
                                        <ListItemAvatar>
                                            <Check color="primary" />
                                        </ListItemAvatar>
                                    )}
                                </ListItem>
                            ))
                        }
                        {!parkingsData && (
                            <ListItem><ListItemText primary='Recherchez un parking' /></ListItem>
                        )}
                        {   parkingsData?.parkings.totalCount === 0 && (
                            <ListItem><ListItemText primary='Aucun résultat trouvé !' /></ListItem>
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
                            label="Période"
                            openTo="month"
                            value={date}
                            onChange={(value) => {
                                setDate(value);
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </LocalizationProvider>
                    <Button onClick={goToThisMonth}>Ce mois</Button>
                    { (loading || parkingLoading) && <CircularProgress size={25} />}
                </CardContent>
            </Card>
            <br />
            
            <Card>
                <CardHeader title={parking ? parking?.name.toUpperCase() + ' - Site: ' + parking?.site?.name : 'Aucun parking !'} />
                <Divider />
                <CardContent>
                    <FormControlLabel 
                        control={
                            <Switch 
                                checked={trigger === 'item' } 
                                onClick={() => setTrigger(trigger === 'axis' ? 'item' : 'axis')} />
                        }
                        label='Info bulle sur les items'/>
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
                            tooltip={{ trigger }}
                        />
                    )}
                    {!chart && <Typography>Aucun contenu récupéré !</Typography>}
                </CardContent>
            </Card>
            <br />
            <Card >
                <CardHeader title={"Rapport global  - Total machine: " + (chart ? chart.totals.reduce((previous, next) => previous + next, 0) : 0) + " CDF"} />
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

export default ParkingRecipes;