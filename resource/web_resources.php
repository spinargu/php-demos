<?php
class web_resources extends resource
{
    function __construct(array $names)
    {
        global $_api_;
        $this->resources = (object)array(
            'public_css' => '/resource/css/publicSite.css',
            'private_css' => '/resource/css/privateSite.css',
            'api_css' => '/resource/css/api.css',
            'theme' => '/resource/css/hidalgo_theme.css',
            'jquery' => '/resource/library/jquery-3.2.1/jquery.min.js',
            'jquery-ui' => '/resource/library/jqueryUI-1.12.1/jquery-ui.js',
            'font-awesome' => '/resource/framework/font-awesome-4.7.0/css/font-awesome.min.css',
            'material-design' => '/resource/framework/material-design/css/materialdesignicons.min.css',
            'view-activities' => '/resource/css/view_calendar_activities.css',
            'bootstrap' => [
                '/resource/framework/bootstrap-3.3.7/js/bootstrap.min.js',
                '/resource/framework/bootstrap-3.3.7/css/bootstrap.min.css',
                '/resource/framework/bootstrap-3.3.7/css/bootstrap_4_btn_outline.css'
            ],
            'jasny-bootstrap' => [
                '/resource/framework/jasny-bootstrap-3.1.3/js/jasny-bootstrap.min.js',
                '/resource/framework/jasny-bootstrap-3.1.3/css/jasny-bootstrap.min.css'
            ],
            'jLimitKeyPress' => '/resource/plugin/external/jLimitKeyPress/jLimitKeyPress.js',
            'jForm' => [
                '/resource/plugin/internal/jForm/jForm.js',
                '/resource/plugin/internal/jForm/jForm.css'
            ],
            'jValidate' => [
                '/resource/plugin/internal/jValidate/jValidate.js',
                '/resource/plugin/internal/jValidate/jValidate.css'
            ],
            'jSelect' => '/resource/plugin/internal/jSelect/jSelect.js',
            'jAjaxRequestManager' => '/resource/plugin/internal/jAjaxRequestManager/jAjaxRequestManager.js',
            'jNotification' => '/resource/plugin/internal/jNotification/jNotification.js',
            'jFunctions' => '/resource/plugin/internal/jFunctions/jFunctions.js',
            'jFileDownloadManager' => '/resource/plugin/internal/jFileDownloadManager/jFileDownloadManager.js',
            'jCookie' => '/resource/plugin/internal/jCookie/jCookie.js',
            'jPDFMake' => [
                '/resource/plugin/external/jPDFMake/pdfmake.min.js',
                '/resource/plugin/external/jPDFMake/vfs_fonts.js'
            ],
            'jXLSX' => [
              '/resource/plugin/external/jXLSX/xlsx.full.min.js'
            ],
            'jZIP' => [
                '/resource/plugin/external/jZIP/jszip.js'
            ],
            'jTree' => [
                '/resource/plugin/internal/jTree/jTree.js',
                '/resource/plugin/internal/jTree/jTree.css'
            ],
            'jFileInput' => [
                '/resource/plugin/external/jFileInput/css/fileinput.min.css',
                '/resource/plugin/external/jFileInput/js/fileinput.min.js',
                '/resource/plugin/external/jFileInput/js/locales/es.js',
                '/resource/plugin/external/jFileInput/js/plugins/sortable.min.js',
                '/resource/plugin/external/jFileInput/js/plugins/purify.min.js',
            ],
            'jModal' => [
                '/resource/plugin/internal/jModal/jModal.js',
                '/resource/plugin/internal/jModal/jModal.css'
            ],
            'jButtonGroup' => [
                '/resource/plugin/internal/jButtonGroup/jButtonGroup.js',
                '/resource/plugin/internal/jButtonGroup/jButtonGroup.css'
            ],
            'jBootstrapDatetimepicker' => [
                '/resource/plugin/external/jBootstrapDatetimepicker/js/moment.js',
                '/resource/plugin/external/jBootstrapDatetimepicker/js/locale_es.js',
                '/resource/plugin/external/jBootstrapDatetimepicker/css/bootstrap-datetimepicker.min.css',
                '/resource/plugin/external/jBootstrapDatetimepicker/js/bootstrap-datetimepicker.min.js',
            ],
            'jList' => [
                '/resource/plugin/internal/jList/jList.js',
                '/resource/plugin/internal/jList/jList.css'
            ],
            'jCheckbox' => [
                '/resource/plugin/internal/jCheckbox/jCheckbox.js',
                '/resource/plugin/internal/jCheckbox/jCheckbox.css'
            ],
            'jPopover' => [
                '/resource/plugin/internal/jPopover/jPopover.js',
                '/resource/plugin/internal/jPopover/jPopover.css'
            ],
            'jBootstrapSwitch' => [
                '/resource/plugin/external/jBootstrapSwitch/js/bootstrap-switch.min.js',
                '/resource/plugin/external/jBootstrapSwitch/css/bootstrap3/bootstrap-switch.min.css'
            ],
            'jAccordion' => [
                '/resource/plugin/internal/jAccordion/jAccordion.js',
                '/resource/plugin/internal/jAccordion/jAccordion.css'
            ],
            'jAdvanceTable' => [
                '/resource/plugin/internal/jAdvanceTable/jAdvanceTable.js',
                '/resource/plugin/internal/jAdvanceTable/jAdvanceTable.css',
                '/resource/plugin/internal/jToolbar/jToolbar.js',
                '/resource/plugin/internal/jToolbar/jToolbar.css',
                '/resource/plugin/external/jBootstrapTable/bootstrap-table.js',
                '/resource/plugin/external/jBootstrapTable/bootstrap-table.min.css'
            ],
            'jAdvanceTable_group_by' => [
                '/resource/plugin/external/jBootstrapTable/bootstrap-table-group-by.min.js',
                '/resource/plugin/external/jBootstrapTable/bootstrap-table-group-by.css'
            ],
            'jAdvanceTable-tree'         => [
                '/resource/plugin/external/jBootstrapTable/bootstrap-table-treegrid.js',
                '/resource/plugin/external/jBootstrapTable/jquery.treegrid.min.css',
                '/resource/plugin/external/jBootstrapTable/jquery.treegrid.min.js'
            ],
            'jMosaic' => [
                '/resource/plugin/internal/jMosaic/jMosaic.js',
                '/resource/plugin/internal/jMosaic/jMosaic.css',
            ],
            'jqueryNumber' => '/resource/plugin/external/jqueryNumber/autoNumeric.js',
            'jPDFObject' => '/resource/plugin/external/jPDFObject/pdfobject.js',
            'jTab' => [
                '/resource/plugin/internal/jTab/jTab.js',
                '/resource/plugin/internal/jTab/jTab.css',
            ],
            'jmultiselect_input' => [
                '/resource/plugin/internal/jmultiselect_input/jmultiselect_input.js',
                '/resource/plugin/internal/jmultiselect_input/jmultiselect_input.css',
            ],
            'jFilter' => [
                '/resource/plugin/internal/jFilter/jFilter.css',
                '/resource/plugin/internal/jFilter/jFilter.js',
            ],
            'jMap' => [
                'https://maps.googleapis.com/maps/api/js?key=' . $_api_->google->api_key,
                '/resource/plugin/internal/jMap/jMap.css',
                '/resource/plugin/internal/jMap/jMap.js',
            ],
            'jPrototype' => [
                '/resource/plugin/internal/jPrototype/jPrototype.js',
            ],
            'chart'            => '/resource/plugin/external/chart/Chart.js',
            'chartLabeles'            =>
                    '/resource/plugin/external/chartLabeles/chartjs-plugin-datalabels.js',
            'pieceLabelChart'            =>
                    '/resource/plugin/external/pieceLabelChart/Chart.PieceLabel.min.js',
            'goChart' => [
                '/resource/plugin/external/go/go.js',
            ],
            'math' => [
                '/resource/plugin/external/math/math.js'
            ],
            'jChips' => [
                '/resource/plugin/internal/jChips/jChips.js',
                '/resource/plugin/internal/jChips/jChips.css',
            ],
            'jMath' => [
                '/resource/plugin/external/jMath/math.min.js',
                '/resource/plugin/external/jMath/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML.js',
            ],
            'jSidebar' => [
                '/resource/plugin/internal/jSidebar/jSidebar.js',
                '/resource/plugin/internal/jSidebar/jSidebar.css',
            ],
            'jTable' => [
                '/resource/plugin/internal/jTable/jTable.js',
                '/resource/plugin/internal/jTable/jTable.css',
            ],

        );
        parent::__construct($names);
    }
}