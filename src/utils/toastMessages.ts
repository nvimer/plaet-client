/**
 * Toast Messages Helper
 * 
 * Provides consistent toast messages throughout the application.
 * Centralizes message text for easier maintenance and localization.
 */

export const ToastMessages = {
  // Success Messages
  SUCCESS: {
    USER_CREATED: "Usuario creado exitosamente",
    USER_UPDATED: "Usuario actualizado exitosamente", 
    USER_DELETED: "Usuario eliminado exitosamente",
    ORDER_CREATED: "Pedido creado exitosamente",
    ORDER_UPDATED: "Orden actualizada exitosamente",
    ORDER_DELETED: "Pedido eliminado exitosamente",
    ORDER_STATUS_UPDATED: "Estado actualizado exitosamente",
    TABLE_CREATED: "Mesa creada exitosamente",
    TABLE_UPDATED: "Mesa actualizada exitosamente",
    TABLE_DELETED: "Mesa eliminada exitosamente",
    TABLE_STATUS_UPDATED: "Estado actualizado exitosamente",
    CATEGORY_CREATED: "Categoría creada exitosamente",
    CATEGORY_UPDATED: "Categoría actualizada exitosamente",
    CATEGORY_DELETED: "Categoría eliminada exitosamente",
    ITEM_CREATED: "Producto creado exitosamente",
    ITEM_UPDATED: "Producto actualizado exitosamente",
    ITEM_DELETED: "Producto eliminado exitosamente",
    PROFILE_UPDATED: "Perfil actualizado exitosamente",
    STOCK_ADDED: "Stock agregado exitosamente",
    STOCK_REMOVED: "Stock removido exitosamente",
    STOCK_RESET: "Stock diario reseteado exitosamente",
  },

  // Error Messages
  ERROR: {
    USER_CREATE_FAILED: "Error al crear usuario",
    USER_UPDATE_FAILED: "Error al actualizar usuario",
    USER_DELETE_FAILED: "Error al eliminar usuario",
    ORDER_CREATE_FAILED: "Error al crear pedido",
    ORDER_UPDATE_FAILED: "Error al actualizar orden",
    ORDER_DELETE_FAILED: "Error al eliminar pedido",
    ORDER_STATUS_UPDATE_FAILED: "Error al actualizar estado",
    TABLE_CREATE_FAILED: "Error al crear mesa",
    TABLE_UPDATE_FAILED: "Error al actualizar mesa",
    TABLE_DELETE_FAILED: "Error al eliminar mesa",
    TABLE_STATUS_UPDATE_FAILED: "Error al actualizar estado de mesa",
    CATEGORY_CREATE_FAILED: "Error al crear categoría",
    CATEGORY_UPDATE_FAILED: "Error al actualizar categoría",
    CATEGORY_DELETE_FAILED: "Error al eliminar categoría",
    ITEM_CREATE_FAILED: "Error al crear producto",
    ITEM_UPDATE_FAILED: "Error al actualizar producto",
    ITEM_DELETE_FAILED: "Error al eliminar producto",
    PROFILE_UPDATE_FAILED: "Error al actualizar perfil",
    STOCK_ADD_FAILED: "Error al agregar stock",
    STOCK_REMOVE_FAILED: "Error al remover stock",
    STOCK_RESET_FAILED: "Error al resetear stock",
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED_FIELD: "Este campo es requerido",
    INVALID_EMAIL: "Email inválido",
    INVALID_PASSWORD: "Contraseña inválida",
    INVALID_QUANTITY: "Cantidad inválida",
    INSUFFICIENT_STOCK: "Stock insuficiente",
    AT_LEAST_ONE_ITEM: "Debes agregar al menos un producto",
    SELECT_TABLE: "Debes seleccionar una mesa para pedidos en local",
    NO_TRACKED_ITEMS: "No hay items con inventario rastreado",
  },

  // Status Messages
  STATUS: {
    PENDING: "Pedido marcado como pendiente",
    IN_KITCHEN: "Pedido en preparación",
    READY: "Pedido listo para entregar",
    DELIVERED: "Pedido entregado",
    PAID: "Pedido pagado",
    CANCELLED: "Pedido cancelado",
  },
} as const;

export default ToastMessages;