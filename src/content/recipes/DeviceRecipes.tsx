import { Grid, Container, TextField, Card, Divider, CardHeader, CardContent } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { startOfMonth } from "date-fns";
import { useState } from "react";


const DeviceRecipes: React.FC = () => {
    const [date, setDate] = useState(startOfMonth(Date.now()));

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
                <CardContent>
                    <TextField
                        required
                        id="serie_number"
                        label="Numéro serie"
                        placeholder="e.g LUB150"
                    />
                </CardContent>
                <CardContent>
                    <DatePicker
                        views={['year', 'month']}
                        label="Date"
                        value={date}
                        onChange={(value) => {
                            console.log(value);
                            setDate(value);
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Container>
    );
}

export default DeviceRecipes;