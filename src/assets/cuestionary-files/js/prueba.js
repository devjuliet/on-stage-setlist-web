
$(document).ready(function () {

    $("#step2").focus(function () {


    });
    /* $("input[name='palineado']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=palineado]:checked').val()
        if (opcion == 'si') { */
            /* var ninos = $('input:checkbox[name=sujetoninasninos]:checked').val();
            if (ninos == 'sujetoninasninos') {
                document.getElementById('divsujetoninasninos').innerHTML = 
                    '<div id="ninos">'+
                    '<label><input [(ngModel)]="pregunta2.derechos[0]"  type="checkbox" value="11" name="d11" id="cualDerecho" class="icheck">A la vida, supervivencia y desarrollo</label>' +
                    '<label><input type="checkbox" value="12" id="cualDerecho" name="d12" class="icheck">De prioridad</label>' +
                    '<label><input type="checkbox" value="13" id="cualDerecho" name="d13" class="icheck">A la identidad</label>' +
                    '<label><input type="checkbox" value="14" id="cualDerecho" name="d14" class="icheck">A vivir en familia</label>' +
                    '<label><input type="checkbox" value="15" id="cualDerecho" name="d15" class="icheck">Al descanso, la recreación y el juego</label>' +
                    '<label><input type="checkbox" value="16" id="cualDerecho" name="d16" class="icheck">A la participación y opinión</label>' +
                    '<label><input type="checkbox" value="17" id="cualDerecho" name="d17" class="icheck">A la asociación y reunión</label>' +
                    '<label><input type="checkbox" value="18" id="cualDerecho" name="d18" class="icheck">A la información</label>' +
                    '<label><input type="checkbox" value="19" id="cualDerecho" name="d19" class="icheck">Al debido proceso</label>'+
                    '</div>';
            }
            else {
                $("#divsujetoninasninos").empty();
            } */
            /* var mayores = $('input:checkbox[name=sujetomayores60]:checked').val();
            if (mayores == 'sujetomayores60') {
                document.getElementById('divmayores60').innerHTML = 
                    '<div id="mayores60">'+
                    '<label><input type="checkbox" value="20" id="d20" name="cualDerecho" class="icheck">A la vida con calidad e independencia</label>' +
                    '<label><input type="checkbox" value="21" id="cualDerecho" name="d21" class="icheck">A la integridad personal y la dignidad</label>' +
                    '<label><input type="checkbox" value="22" id="cualDerecho" name="d22" class="icheck">Al acceso a la justicia</label>' +
                    '<label><input type="checkbox" value="23" id="cualDerecho" name="d23" class="icheck">A la atención preferente y diferenciada</label>' +
                    '<label><input type="checkbox" value="24" id="cualDerecho" name="d24" class="icheck">A la asistencia social cuando se encuentren en situación de vulnerabilidad</label>' +
                    '<label><input type="checkbox" value="25" id="cualDerecho" name="d25" class="icheck">A la protección contra todo abuso, expltoación y cualqueir forma de maltrato</label>' +
                    '<label><input type="checkbox" value="26" id="cualDerecho" name="d26" class="icheck">A la recreación y el esparcimiento</label>' +
                    '<label><input type="checkbox" value="27" id="cualDerecho" name="d27" class="icheck">A la participación plena y efectiva en los ámbitos de interés</label>' +
                    '</div>';
            }
            else {
                $("#divmayores60").empty();
            } */
            /* var mujeres = $('input:checkbox[name=sujetomujeres]:checked').val();
            if (mujeres == 'sujetomujeres') {
                document.getElementById('divmujeres').innerHTML = 
                '<div id="mujeres">'+
                '<label><input type="checkbox" value="28" name="d28" name="cualDerecho" class="icheck">A la igualdad</label>' +
                    '<label><input type="checkbox" value="29" id="cualDerecho" name="d29" class="icheck">A la equidad</label>' +
                    '<label><input type="checkbox" value="30" id="cualDerecho" name="d30" class="icheck">A la intimidad</label>' +
                    '<label><input type="checkbox" value="31" id="cualDerecho" name="d31" class="icheck">A la integridad física, sicoemocional y sexual de las mujeres</label>' +
                    '<label><input type="checkbox" value="32" id="cualDerecho" name="d32" class="icheck">A el patrimonio</label>' +
                    '<label><input type="checkbox" value="33" id="cualDerecho" name="d33" class="icheck">A el pleno ejercicio de los derechos políticos</label>' +
                    '</div>';
            }
            else {
                $("#mujeres").empty();
            } */
            /* var discapacidad = $('input:checkbox[name=sujetodiscapacidad]:checked').val();
            if (discapacidad == 'sujetodiscapacidad') {
                document.getElementById('divdiscapacidad').innerHTML = 
                '<div id="discapacidad">'+
                    '<label><input type="checkbox" value="34" id="cualDerecho" name="d34" class="icheck">A tener en los espacios públicos y privados, abiertos o cerrados, condiciones propicias para su libre y seguro desplazamiento</label>' +
                    '<label><input type="checkbox" value="35" id="cualDerecho" name="d35" class="icheck">A disfrutar de los servicios públicos en igualdad de circustancias que cualquier personas sin discapacidad</label>' +
                    '<label><input type="checkbox" value="36" id="cualDerecho" name="d36" class="icheck">A asociarse con la finalidad de contribuir a su óptima integración</label>' +
                    '<label><input type="checkbox" value="37" id="cualDerecho" name="d37" class="icheck">A gozar de trato preferente y contar con la ayuda necesaria por parte de quienes prestan atención al público en instituciones públicas y privadas</label>' +
                '</div>';
            }
            else {
                $("#discapacidad").empty();
            } */
            /* document.getElementById('opciones').innerHTML = 
            '<div class="col-md-6>">' +
                '<label><input type="checkbox" value="1" id="cualDerecho" name="d1" class="icheck">A la salud y deporte</label>' +
                '<label><input type="checkbox" value="2" id="cualDerecho" name="d2" class="icheck ">A la seguridad social</label>' +
                '<label><input type="checkbox" value="3" id="cualDerecho" name="d3" class="icheck">Al trabajo y el goce de sus condiciones equitativas y satisfactorias</label>' +
                '<label><input type="checkbox" value="4" id="cualDerecho" name="d4" class="icheck">A la alimentación y nutrición</label>' +
                '	<label><input type="checkbox" value="5" id="cualDerecho" name="d5" class=" ">A la Educación</label>' +
                '	<label><input type="checkbox" value="6" id="cualDerecho" name="d6" class=" ">A una vida libre de violencia de género</label>' +
                '	<label><input type="checkbox" value="7" id="cualDerecho" name="d7" class=" ">A la vivienda</label>' +
                '	<label><input type="checkbox" value="8" id="cualDerecho" name="d8" class=" ">Al medio ambiente sano</label>' +
                '	<label><input type="checkbox" value="9" id="cualDerecho" name="d9" class=" ">A la  no  discriminación  en  los  términos  de  la  Constitución  Política  de  los  Estados Unidos Mexicanos, la particular del Estado, la presente ley y demás disposiciones aplicables</label>' +
                '	<label><input type="checkbox" value="10" id="cualDerecho" name="d10" class=" ">A la infraestructura social básica</label>' +
                '	<label><input type="checkbox" value="11" id="cualDerecho" name="d11" class=" ">A la participación en los procesos de desarrollo social y humano</label>' +
            '</div>'; */
        /* }
        if (opcion == 'no') {
            $("#opciones").empty();
            $('#divsujetoninasninos').empty();
            $('#divmayores60').empty();
            $('#divmujeres').empty();
            $('#divdiscapacidad').empty();
        }
    }); */

    /* $("#sujetootro").on('ifChecked', function (event) {
        document.getElementById('sujetoespecifico').innerHTML = '<input type="text" class="form-control" name="definasujeto" id="definasujeto" placeholder="Especifique" required>';
    });
    $("#sujetootro").on('ifUnchecked', function (event) {
        $("#sujetoespecifico").empty();
    }); */

    /* $("input[name='condicionvulnerabilidad']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=condicionvulnerabilidad]:checked').val()
        if (opcion == 'si') {
            document.getElementById('condicionpobreza').innerHTML =
                '<div class="col-md-12">' +
                '	<div class="form-group radio_input">' +
                '		<label><input type="radio" value="pobreza" name="cpobreza" id="cpobreza" class="icheck required">Personas en condición de pobreza</label>' +
                '</div>' +
                '	<div class="form-group radio_input">' +
                '		<label><input type="radio" value="pobrezaextrema" name="cpobreza" id="cpobreza" class="icheck required">Personas en condición de pobreza extrema</label>' +
                '</div>' +
                '	<div class="form-group radio_input">' +
                '		<label><input type="radio" value="vulnerable" name="cpobreza" id="cpobreza" class="icheck required">Personas en condición vulnerable</label>' +
                '</div>' +
                '	<div class="form-group radio_input">' +
                '		<label><input type="radio" value="zonaprioritariaestatal" name="cpobreza" id="cpobreza" class="icheck required">Personas habitantes de zonas de atención prioritaria estatales</label>' +
                '	</div>' +
                '	<div class="form-group radio_input">' +
                '		<label><input type="radio" value="zonaprioritariafederal" name="cpobreza" id="cpobreza" class="icheck required">Personas habitantes de zonas de atención prioritaria federales</label>' +
                '	</div>' +
                '</div>' +
                '<br><br><br>';
        }
        if (opcion == 'no') {
            $("#condicionpobreza").empty();
        }
    }); */

    /* $("input[name='cuentapadron']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=cuentapadron]:checked').val()
        if (opcion == 'si') {
            document.getElementById('divcuentapadron').innerHTML = '<input type="text" class="form-control" name="ligapadron" id="ligapadron" placeholder="Escriba la liga en donde puede ser consultado" required>';
        }
        if (opcion == 'no') {
            $("#divcuentapadron").empty();
        }
    }); */

    /* $("input[name='reglasoperacion']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=reglasoperacion]:checked').val()
        if (opcion == 'si') {
            document.getElementById('divreglasoperacion').innerHTML = '<input type="text" class="form-control" name="ligareglas" id="ligareglas" placeholder="Escriba la liga en donde pueden ser consultadas" required>';
        }
        if (opcion == 'no') {
            $("#divreglasoperacion").empty();
        }
    }); */

    $("input[name='interespublico']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=interespublico]:checked').val()
        if (opcion == 'otro') {
            document.getElementById('divinterespublico').innerHTML = '<input type="text" name="especifiqueinterespublico" id="especifiqueinterespublico" placeholder="Especifique" class="form-control required">';
        }
        if (opcion != 'otro') {
            $("#divinterespublico").empty();
        }
    });

    /* $("input[name='derechosocial']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=derechosocial]:checked').val()
        if (opcion == 'si') {
            document.getElementById('divderechosocial').innerHTML =
                '<select class="form-control" name="pcderechosocial" id="pcderechosocial">' +
                '<option value = "1">Garantizar las condiciones que aseguren el disfrute de los derechos sociales</option>' +
                '<option value = "2">Promover un desarrollo económico con sentido social que propicie las condiciones para conservar el empleo, elevar el nivel de ingreso y mejorar su distribución</option>' +
                '<option value = "3">Promover y fortalecer el desarrollo armónico regional y municipal</option>' +
                '<option value = "4">Superar las condiciones de pobreza, desigualdad, marginación, vulnerabilidad, discriminación y exlusión presentes en la sociedad</option>' +
                '<option value = "5">Propiciar las condiciones para la participación consciente, organizada y activa de la sociedad en la formulación, ejecución, evaluación y control de los programas y proyectos, en los términos de la Ley de Desarrollo Humano y Social del Estado de Chihuahua, tratándose de pueblos y comunidades indígenas, se estará a las modalidades previstas en la ley de la materia.</option>' +
                '<option value = "6">Promover el desarrollo social y humano</option>' +
                '</select>';
        }
        if (opcion == 'no') {
            $("#divderechosocial").empty();
            $('#pregunta').fadeOut();
        }
    }); */

    $("input[name='eapoyosocial']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=eapoyosocial]:checked').val()
        if (opcion == 'otro') {
            document.getElementById('divinterespublico').innerHTML = '<input type="text" name="especifiqueinterespublico" placeholder="Especifique" class="form-control required">';
        }
        if (opcion != 'otro') {
            $("#divinterespublico").empty();
        }
    });

    /* $("input[name='eapoyosocial']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=eapoyosocial]:checked').val()
        if (opcion == 'si') {
            document.getElementById('divasociales').innerHTML =
                '<select class="form-control" id="capoyosocial" name="capoyosocial">' +
                '<option value="1">Acciones para el monitoreo, protección, conservación y/o reforestación de recursos naturales (aire, agua, bosques, desiertos, selvas y vida silvestre)</option>' +
                '<option value="2">Acciones para el suministro y/o supervisión del sistema de agua potable</option>' +
                '<option value="3">Actividades recreativas y/o culturales</option>' +
                '<option value="4">Alimentación</option>' +
                '<option value="5">Apoyo a gestiones administrativas</option>' +
                '<option value="6">Apoyo para actividades o proyectos de investigación</option>' +
                '<option value="7">Apoyo para actividades o proyectos sociales</option>' +
                '<option value="8">Apoyo para adquirir, edificar, terminar, ampliar o modificar la vivienda</option>' +
                '<option value="9">Apoyo para certificaciones o constancias</option>' +
                '<option value="10">Apoyo para el desarrollo de proyectos culturales</option>' +
                '<option value="11">Apoyo para el transporte</option>' +
                '<option value="12">Apoyo y/o financiamiento para el desarrollo, mejora o consolidación de actividades o proyectos productivos</option>' +
                '<option value="13">Beca</option>' +
                '<option value="14">Capacitación, asesoría u orientación</option>' +
                '<option value="15">Compensación garantizada al ingreso</option>' +
                '<option value="16">Constucción, mantenimiento, rehabilitación y/o financiamiento de infraestructura y/u obra pública</option>' +
                '<option value="17">Difusión o promoción</option>' +
                '<option value="18">Estímulo económico</option>' +
                '<option value="19">Financiamiento de servicios</option>' +
                '<option value="20">Insumos o equipo para la producción</option>' +
                '<option value="21">Legalización de la tenencia de la tierra </option>' +
                '<option value="22">Libros y/o material didáctico</option>' +
                '<option value="23">Material para la salud</option>' +
                '<option value="24">Apoyo para trámites y servicios</option>' +
                '<option value="25">Fortalecimiento de capacidades y/o habilidades para la vida</option>' +
                '<option value="26">Servicios públicos</option>' +
                '<option value="27">Otro (especifique)</option>' +
                '</select>' +
                '<div id="tipoapoyo">'
            '</div>';
        }
        if (opcion == 'no') {
            $("#divasociales").empty();
        }
    }); */


    $("select[name='capoyosocial']").on('change', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=capoyosocial]:checked').val()
        if (opcion == 'otro') {
            document.getElementById('tipoapoyo').innerHTML = '<input type="text" name="especifiqueapoyo" placeholder="Especifique" class="form-control required">';
        }
        if (opcion != 'otro') {
            $("#tipoapoyo").empty();
        }
    });

    $("input[name='subcategoriaprograma']").on('ifChanged', function (e) {
        $(this).trigger("onclick", e);
        var opcion = $('input:radio[name=subcategoriaprograma]:checked').val()
        if (opcion == 'desarrollocapacidades') {
            document.getElementById('subprogramacapacidades').innerHTML = '<input type="text" class="form-control" name="especifiquecapacidades" id="especifiquecapacidades" placeholder="Especifique" required><br><br> ';
        }
        if (opcion != 'desarrollocapacidades') {
            $("#subprogramacapacidades").empty();
        }
    });

});