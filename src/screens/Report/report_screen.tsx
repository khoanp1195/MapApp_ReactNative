import { View, Text, processColor, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { PieChart } from "react-native-charts-wrapper";
import { dimnensHeight } from '../../config/font';
import { AppBarHeader } from '../../component/AppBarHeader';

const dataPieChart = {
    dataSets: [
        {
            values: [
                { value: 0, label: "VB mới nhất" },
                { value: 0, label: "VB yêu thích" },
                { value: 0, label: "VB xem nhiều" },
                { value: 0, label: "Bộ tiêu chuẩn" },
            ],
            label: "",
            config: {
                colors: [
                    processColor("#f87080"),
                    processColor("#fdc065"),
                    processColor("#ab89f7"),
                    processColor("#dbedea")
                ],
                drawValues: true,
                valueTextSize: 15,
                valueTextColor: processColor("#000"),
                valueFormatter: "#.#'%'",
                sliceSpace: 5,
                selectionShift: 100,
                yValuePosition: "OUTSIDE_SLICE",
            },
        },
    ],
    highlights: [{ x: 2 }],
};

export const Report_Screen = () => {
    const [dataChart, setdataChart] = useState(dataPieChart)

    const chartDimention = useMemo(() => {
        const scale = Dimensions.get('window').scale
        const dimention = dimnensHeight(scale)
        return dimention
    }, [])

    useEffect(() => {
        const newData = {
            dataSets: [
                {
                    ...dataChart?.dataSets[0],
                    values: [
                        {
                            value: 10,
                            label: "VB mới nhất",
                        },
                        {
                            value: 20,
                            label: "VB yêu thích",

                        },
                        {
                            value: 30,
                            label: "VB xem nhiều",

                        },
                        {
                            value: 40,
                            label: "Bộ tiêu chuẩn",

                        },
                    ],
                },
            ],
            description: {
                text: 'This is Pie chart description',
                textSize: 15,
                textColor: processColor('darkgray'),

            }
        };
        // @ts-ignore
        setdataChart(newData);
    }, [])
    return (
        <View style={styles.container}>
            {/* Header */}
            <AppBarHeader title={'Report'} />

            <PieChart
                style={[styles.viewChart, {
                    // height: 20 + (chartDimention) + '%',
                    height: '50%',
                    width: '90%' + (chartDimention * Dimensions.get('window').scale) + '%',
                    alignSelf: 'center',
                    marginTop: 15

                }]}
                logEnabled={true}
                chartBackgroundColor={processColor("transparent")}
                chartDescription={{ text: "" }}
                data={dataChart}
                legend={{
                    enabled: false, // Disable legend
                    horizontalAlignment: 'CENTER', // Set legend position to the left
                    verticalAlignment: 'TOP',// Adjust vertical alignment if necessary
                }}
                highlights={[]}
                noDataText={"No data chart !"}
                entryLabelColor={processColor("black")}
                entryLabelTextSize={12}
                touchEnabled={false}
                drawEntryLabels={false}
                usePercentValues={true}
                rotationEnabled={true}
                centerText={""}
                onSelect={() => { }}
                centerTextRadiusPercent={0}
                holeRadius={30}
                transparentCircleRadius={0}
                maxAngle={360}
                rotationAngle={45}
            />


            <View
                style={
                    {
                        width: '100%',
                        backgroundColor: 'rgb(242, 242, 242)',
                        height: '60%',
                        flexDirection: 'column',
                        marginTop: 15
                    }
                }>
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <View style={{ marginLeft: '10%', backgroundColor: '#f87080', width: 20, height: 20 }}>
                    </View>
                    <View >
                        <Text
                            style={{
                                marginLeft: '8%', fontWeight: '600'
                            }}
                        >
                            Vb mới nhất
                        </Text>
                        <Text
                            style={{
                                marginLeft: '8%',
                                color: 'gray'
                            }}
                        >
                            10 vb mới nhất
                        </Text>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', height: 50 }}>
                    <View style={{ marginLeft: '10%', backgroundColor: '#fdc065', width: 20, height: 20 }}>
                    </View>
                    <View >
                        <Text
                            style={{
                                marginLeft: '8%', fontWeight: '600'
                            }}
                        >
                            Vb yêu thích
                        </Text>
                        <Text
                            style={{
                                marginLeft: '8%',
                                color: 'gray'
                            }}
                        >
                            10 Vb yêu thích
                        </Text>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', height: 50 }}>
                    <View style={{ marginLeft: '10%', backgroundColor: '#ab89f7', width: 20, height: 20 }}>
                    </View>
                    <View >
                        <Text
                            style={{
                                marginLeft: '8%', fontWeight: '600'
                            }}
                        >
                            Vb xem nhiều nhất
                        </Text>
                        <Text
                            style={{
                                marginLeft: '8%',
                                color: 'gray'
                            }}
                        >
                            10 Vb xem nhiều nhất
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', height: 50 }}>
                    <View style={{ marginLeft: '10%', backgroundColor: '#dbedea', width: 20, height: 20 }}>
                    </View>
                    <View >
                        <Text
                            style={{
                                marginLeft: '8%', fontWeight: '600'
                            }}
                        >
                            Bộ tiêu chuẩn
                        </Text>
                        <Text
                            style={{
                                marginLeft: '8%',
                                color: 'gray'
                            }}
                        >
                            10 Bộ tiêu chuẩn
                        </Text>
                    </View>
                </View>


            </View>



        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    viewChart: {
        backgroundColor: 'white',
        borderRadius: 15,
        fontSize: 18,
        elevation: 8,
        shadowColor: 'lightgrey',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },

    view_chart: {
        width: '70%',
        height: 100,
        alignSelf: 'center',
        backgroundColor: 'blue',
        flexDirection: 'column',
        borderRadius: 25,
        shadowOffset: {
            width: 5,   // Horizontal shadow offset
            height: 5,  // Vertical shadow offset
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5, // Android only, controls the depth of the shadow
    },

});