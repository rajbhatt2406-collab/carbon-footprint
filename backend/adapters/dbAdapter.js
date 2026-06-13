const { db, useSimulation } = require('../config/firebase');
const dbMock = require('../utils/dbMock');

/**
 * Unified Database Adapter to abstract storage operations.
 * Isolates Firestore-specific queries and in-memory mock queries.
 */
const dbAdapter = {
  /**
   * Finds multiple documents matching a query function or conditions.
   * @param {string} collectionName - Target collection name
   * @param {Function} queryFn - In-memory mock filter callback
   * @param {Function} [fsQueryBuilder] - Firestore query builder callback: query => query.where(...)
   * @returns {Promise<Array>} List of matching documents
   */
  async find(collectionName, queryFn, fsQueryBuilder) {
    if (useSimulation) {
      return dbMock.find(collectionName, queryFn);
    }
    
    let query = db.collection(collectionName);
    if (fsQueryBuilder) {
      query = fsQueryBuilder(query);
    }
    
    const snapshot = await query.get();
    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  },

  /**
   * Finds a single document by ID or custom query function.
   * @param {string} collectionName - Target collection name
   * @param {string} id - Document ID
   * @param {Function} [queryFn] - In-memory mock filter callback
   * @returns {Promise<Object|null>} The matching document or null
   */
  async findById(collectionName, id, queryFn) {
    if (useSimulation) {
      return dbMock.findById(collectionName, id) || (queryFn ? dbMock.findOne(collectionName, queryFn) : null);
    }

    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Finds a single document matching a query.
   * @param {string} collectionName - Target collection name
   * @param {Function} queryFn - In-memory mock filter callback
   * @param {Function} [fsQueryBuilder] - Firestore query builder callback
   * @returns {Promise<Object|null>} The matching document or null
   */
  async findOne(collectionName, queryFn, fsQueryBuilder) {
    if (useSimulation) {
      return dbMock.findOne(collectionName, queryFn);
    }

    let query = db.collection(collectionName);
    if (fsQueryBuilder) {
      query = fsQueryBuilder(query);
    }
    
    const snapshot = await query.limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Inserts a document into the collection.
   * @param {string} collectionName - Target collection name
   * @param {Object} data - Document data to save
   * @returns {Promise<Object>} The saved document including database-assigned ID
   */
  async insert(collectionName, data) {
    if (useSimulation) {
      return dbMock.insert(collectionName, data);
    }

    const ref = await db.collection(collectionName).add(data);
    return { id: ref.id, ...data };
  },

  /**
   * Updates an existing document in the collection.
   * @param {string} collectionName - Target collection name
   * @param {string} id - Document ID to update
   * @param {Object} updates - Attributes to update
   * @returns {Promise<Object|null>} The updated document attributes
   */
  async update(collectionName, id, updates) {
    if (useSimulation) {
      return dbMock.update(collectionName, id, updates);
    }

    const ref = db.collection(collectionName).doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    
    await ref.update(updates);
    return { id, ...doc.data(), ...updates };
  },

  /**
   * Deletes a document from the collection.
   * @param {string} collectionName - Target collection name
   * @param {string} id - Document ID to delete
   * @returns {Promise<Object|null>} The deleted document details or null
   */
  async delete(collectionName, id) {
    if (useSimulation) {
      return dbMock.delete(collectionName, id);
    }

    const ref = db.collection(collectionName).doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;

    await ref.delete();
    return { id, ...doc.data() };
  }
};

module.exports = dbAdapter;
