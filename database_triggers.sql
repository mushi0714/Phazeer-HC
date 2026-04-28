USE PhazeerDB;

-- 1. Borramos los triggers anteriores para evitar duplicados
DROP TRIGGER IF EXISTS TR_Validar_Venta_Segura;
DROP TRIGGER IF EXISTS TR_Descontar_Stock;

DELIMITER //

-- ==========================================
-- TRIGGER 1: EL GUARDIÁN MÉDICO (Validación Estricta)
-- ==========================================
CREATE TRIGGER TR_Validar_Venta_Segura
BEFORE INSERT ON Detalle_Pedido
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    DECLARE v_caducidad DATE;

    SELECT cantidad_stock, fecha_caducidad INTO v_stock, v_caducidad
    FROM Lotes 
    WHERE id_lote = NEW.id_lote;

    IF NEW.cantidad > v_stock THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'BLOQUEO PHAZEER: Stock insuficiente en este lote para procesar el pedido.';
    END IF;

    IF v_caducidad < CURRENT_DATE THEN
        -- Quité también la tilde de 'Operacion' para evitar cualquier warning de formato
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'ALERTA SANITARIA PHAZEER: Intento de venta de insumos caducados. Operacion cancelada.';
    END IF;
END //

-- ==========================================
-- TRIGGER 2: EL GESTOR DE INVENTARIO (Automatización)
-- ==========================================
CREATE TRIGGER TR_Descontar_Stock
AFTER INSERT ON Detalle_Pedido
FOR EACH ROW
BEGIN
    UPDATE Lotes
    SET cantidad_stock = cantidad_stock - NEW.cantidad
    WHERE id_lote = NEW.id_lote;
END //

DELIMITER ;