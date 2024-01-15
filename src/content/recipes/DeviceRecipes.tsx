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
    Button
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { endOfDay, endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Session } from "./types";
import { PARKING_SESSIONS } from "./api";
import { Collection } from "src/api/types";
import { SearchOutlined } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";


const DeviceRecipes: React.FC = () => {
    const [code, setCode] = useState(''); // Code of device
    const [date, setDate] = useState(startOfMonth(Date.now()));
    const [sessionsQuery, { data, loading, error }] = useLazyQuery<{ parkingSessions: Collection<Session>}, { before: string, after: string/*, parking?: string */, device?: string }>(PARKING_SESSIONS);

    const getSessions = () => {
        if(code){
            sessionsQuery({
                variables: {
                    after: date.toISOString(),
                    before: endOfMonth(date).toISOString(),
                    device: code
                }
            });
        } else {
            alert('Invalid empty code!');
        }
    };

    const goToThisMonth = () => {
        setDate(startOfMonth(Date.now()));
    }
    useEffect(() => {
        // TODO: Conversion des dates de fin de sessions en date locale pour une cohérence des informations
        console.log(data, error, date.toISOString());
    }, [data, error, date]);

    return (
      <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
            <Card>
                <CardHeader title="Recette de la machine" />
                <Divider />
                <CardContent sx={{ alignItems: 'center' }}>
                    <TextField
                        value={code}
                        onChange={({ target: { value }}) => {
                            setCode(value);
                        }}
                        id="serie_number"
                        label="Numéro serie"
                        placeholder="e.g LUB150"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            views={['year', 'month']}
                            label="Date"
                            openTo="year"
                            value={date}
                            onChange={(value) => {
                                setDate(value);
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </LocalizationProvider>
                    <IconButton onClick={() => getSessions()}><SearchOutlined /></IconButton>
                    { loading && <CircularProgress size={25} />}
                    <Button onClick={goToThisMonth}>Ce mois</Button>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Container>
    );
}

export default DeviceRecipes;