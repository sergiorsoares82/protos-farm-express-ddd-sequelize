import type { IPersonRepository } from '../../domain/person/person.repository';
import { Notification } from '../../domain/_shared/validators/notification';
import type { Uuid } from '../../domain/_shared/value-objects/uuid.vo';

export class PersonUniquenessService {
  constructor(private readonly personRepository: IPersonRepository) {}

  /**
   * Checks if name and documentNumber are unique.
   * @param notification Notification instance to accumulate errors.
   * @param name Name to check.
   * @param documentNumber Document number to check.
   * @param ignoreId Optional person_id to ignore (useful for updates).
   */
  async checkUnique(
    notification: Notification,
    name: string,
    documentNumber: string,
    // ignoreId?: Uuid,
  ): Promise<void> {
    const [nameExists, docExists] = await Promise.all([
      this.personRepository.existsByName(name),
      this.personRepository.existsByDocumentNumber(documentNumber),
    ]);

    if (nameExists) {
      notification.addError(`Name '${name}' is already in use.`, 'name');
    }
    if (docExists) {
      notification.addError(
        `Document number '${documentNumber}' is already in use.`,
        'document_number',
      );
    }
  }

  async checkUniqueName(
    notification: Notification,
    name: string,
    ignoreId?: Uuid,
  ): Promise<boolean> {
    console.log('name', name);
    const nameExists = await this.personRepository.existsByName(name, ignoreId);

    if (nameExists) {
      notification.addError(`Name '${name}' is already in use.`, 'name');
      return true;
    }
    return false;
  }

  async checkUniqueDocumentNumber(
    notification: Notification,
    documentNumber: string,
    ignoreId?: Uuid,
  ): Promise<boolean> {
    const docExists = await this.personRepository.existsByDocumentNumber(
      documentNumber,
      ignoreId,
    );

    if (docExists) {
      notification.addError(
        `Document number '${documentNumber}' is already in use.`,
        'document_number',
      );
      return true;
    }
    return false;
  }
}
