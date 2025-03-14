@extends('adminlte::page')

{{-- Extend and customize the browser title --}}

@section('title')
{{ config('adminlte.title') }}
@hasSection('subtitle') | @yield('subtitle') @endif
@stop

{{-- Extend and customize the page content header --}}
@section('plugins.Chart.js', true)
@section('content_header')
@hasSection('content_header_title')
    <h1 class="text-muted">
        @yield('content_header_title')

        @hasSection('content_header_subtitle')
            <small class="text-dark">
                <i class="fas fa-xs fa-angle-right text-muted"></i>
                @yield('content_header_subtitle')
            </small>
        @endif
    </h1>
@endif
@stop

{{-- Rename section content to content_body --}}

@section('content')
<!-- @yield('content_body') -->
<div class="row mt-2 d-flex align-items-center">
    <x-adminlte-card title="Form Card" theme="maroon" theme-mode="outline" class="elevation-3 col-12"
        body-class="bg-maroon" header-class="bg-light" footer-class="bg-maroon border-top rounded border-light"
        icon="fas fa-lg fa-bell" collapsible removable maximizable>
        <form method="GET" action="{{ route("admin.year") }}" id="searchForm">
            <x-adminlte-select fgroup-class="col-md-6" name="year" label="Ano" label-class="text-lightblue"
                igroup-size="lg" form="searchForm">
                @for ($ano = $startYear; $ano <= $currentYear; $ano++)
                    <option value="{{ $ano }}">
                        {{ $ano }}
                    </option>
                @endfor
            </x-adminlte-select>
            <x-adminlte-select fgroup-class="col-md-6" name="month" label="Mês" label-class="text-lightblue"
                igroup-size="lg" form="searchForm">
                @foreach (range(1, 12) as $mes)
                    <option value="{{ $mes }}">
                        {{ \Carbon\Carbon::create()->locale('pt_BR')->month($mes)->translatedFormat('F') }}
                    </option>
                @endforeach
            </x-adminlte-select>
            <x-slot name="footerSlot">
                <x-adminlte-button class="d-flex ml-auto" theme="light" label="submit" type="submit"
                    icon="fas fa-sign-in" form="searchForm" />
            </x-slot>
        </form>
    </x-adminlte-card>
</div>
<div class="row">
    <div class="col-md-6">
        <!-- AREA CHART -->
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Serviços por Ano</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                            class="fa fa-times"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="chart">
                    <canvas id="areaChartYear" style="height: 250px; width: 788px;" height="250" width="788"></canvas>
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
    <div class="col-md-6">
        <!-- AREA CHART -->
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Serviços por Mês</h3>
                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                            class="fa fa-times"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="chart">
                    <canvas id="areaChartMonth" style="height: 250px; width: 788px;" height="250" width="788"></canvas>
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <!-- AREA CHART -->
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Serviços por estado</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                            class="fa fa-times"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="chart">
                    <canvas id="areaChartState" style="height: 250px; width: 788px;" height="250" width="788"></canvas>
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
    <div class="col-md-6">
        <!-- AREA CHART -->
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Serviços por estado e mês</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                            class="fa fa-times"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="chart">
                    <canvas id="areaChartStateMonth" style="height: 250px; width: 788px;" height="250"
                        width="788"></canvas>
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<!-- /.row -->

@stop

{{-- Create a common footer --}}

@section('footer')
<div class="float-right">
    Version: {{ config('app.version', '1.0.0') }}
</div>

<strong>
    <a href="{{ config('app.company_url', '#') }}">
        {{ config('app.company_name', 'My company') }}
    </a>
</strong>
@stop

{{-- Add common Javascript/Jquery code --}}

@push('js')
    <script>
        $(document).ready(function () {

            // Recebendo os dados do controlador (passados pela view)

            // console.log(labels, data);
            const yearChart = () => {
                var ctx = document.getElementById('areaChartYear').getContext('2d');
                var labels = @json($yearData['labels']);
                var data = @json($yearData['data']);
                var myChart = new Chart(ctx, {
                    type: 'bar', // Tipo de gráfico (ex: 'bar', 'line', etc.)
                    data: {
                        labels: labels, // Labels do gráfico
                        datasets: [{
                            label: `Serviços em {{ $yearData['year'] }}`,
                            data: data, // Dados para cada label
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            const monthChart = () => {
                const year = "{{ $monthData['year'] }}";
                const month = "{{ $monthData['month'] }}";
                var ctx = document.getElementById('areaChartMonth').getContext('2d');
                var labels = @json($monthData['labels']);
                var data = @json($monthData['data']);
                var myChart = new Chart(ctx, {
                    type: 'bar', // Tipo de gráfico (ex: 'bar', 'line', etc.)
                    data: {
                        labels: labels, // Labels do gráfico
                        datasets: [{
                            label: `Serviço no mês ${month} de ${year}`,
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            const stateChart = () => {
                var ctx = document.getElementById('areaChartState').getContext('2d');
                var labels = @json($stateYearData['labels']);
                var data = @json($stateYearData['data']);
                var myChart = new Chart(ctx, {
                    type: 'bar', // Tipo de gráfico (ex: 'bar', 'line', etc.)
                    data: {
                        labels: labels, // Labels do gráfico
                        datasets: [{
                            label: `Serviços em {{ $stateYearData['year'] }} por estado`,
                            data: data, // Dados para cada label
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            const stateChartMonth = () => {
                var ctx = document.getElementById('areaChartStateMonth').getContext('2d');
                var labels = @json($stateMonthData['labels']);
                var data = @json($stateMonthData['data']);
                var myChart = new Chart(ctx, {
                    type: 'bar', // Tipo de gráfico (ex: 'bar', 'line', etc.)
                    data: {
                        labels: labels, // Labels do gráfico
                        datasets: [{
                            label: `Serviços em {{ $stateMonthData['year'] }} por estado no mês {{ $stateMonthData['month'] }}`,
                            data: data, // Dados para cada label
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            yearChart();
            monthChart();
            stateChart();
            stateChartMonth();
        });
    </script>


@endpush

{{-- Add common CSS customizations --}}

@push('css')
    <style type="text/css">
    </style>
@endpush